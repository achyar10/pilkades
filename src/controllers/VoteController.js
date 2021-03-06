import model from '../models'
import { Op } from 'sequelize'
class VoteController {

    index = async (req, res) => {
        try {
            let query = {}
            if (req.user.role !== 'superadmin') query = { tpsId: req.user.tpsId }
            const data = await model.vote.findAll({
                where: query,
                include: [
                    { model: model.user, attributes: ['fullname'] },
                    { model: model.candidate, attributes: ['no_urut', 'name'] },
                    { model: model.tps, as: 'tps', attributes: ['no_tps', 'total_dpt'] },
                ]
            })
            res.render('vote', {
                title: 'Daftar Hasil Perhitungan Suara',
                data
            })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    add = async (req, res) => {
        try {
            let candidates = []
            let remainDpt = 0
            if (req.user.role === 'admin') {
                const tps = await model.tps.findOne({
                    where: { id: req.user.tpsId },
                    attributes: ['total_dpt'],
                    raw: true
                })
                const vote = await model.vote.findAll({
                    where: { tpsId: req.user.tpsId },
                    attributes: ['candidateId', 'numberOfVote'],
                    raw: true
                })
                let arrId = [], total = 0
                vote.map(el => {
                    arrId.push(el.candidateId)
                    total += el.numberOfVote
                })
                remainDpt = parseInt(tps.total_dpt) - total
                candidates = await model.candidate.findAll({
                    where: { id: { [Op.notIn]: arrId } },
                    attributes: ['id', 'no_urut', 'name'],
                    order: [['no_urut', 'ASC']],
                    raw: true
                })
            } else {
                candidates = await model.candidate.findAll({
                    attributes: ['id', 'no_urut', 'name'],
                    order: [['no_urut', 'ASC']],
                    raw: true
                })
            }
            const tps = await model.tps.findAll({ attributes: ['id', 'no_tps', 'total_dpt'] })
            res.render('vote/add', {
                title: 'Tambah Perhitungan Suara',
                csrf: req.csrfToken(),
                candidates, tps, remainDpt
            })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    create = async (req, res) => {
        let { candidateId, tpsId, numberOfVote, male, female } = req.body
        try {
            if (req.user.role !== 'superadmin') tpsId = req.user.tpsId
            const check = await model.vote.findOne({ where: { candidateId, tpsId } })
            if (check) {
                req.flash('error_msg', "Calon di TPS tersebut sudah pernah di inputkan!");
                return res.redirect('/vote')
            }
            const checkDist = await model.tps.findOne({ where: { id: tpsId } })
            if (!checkDist) {
                req.flash('error_msg', "TPS tidak ditemukan!");
                return res.redirect('/vote')
            }
            const totalIn = await model.vote.sum('numberOfVote', { where: { tpsId } }) || 0
            if ((totalIn + parseInt(numberOfVote)) > checkDist.total_dpt) {
                req.flash('error_msg', "Total suara melebihi kapasitas daftar pemilih tetap!");
                return res.redirect('/vote')
            }
            model.vote.create({
                userId: req.user.id,
                districtId: checkDist.districtId,
                candidateId, tpsId, numberOfVote, male, female
            })
                .then(() => {
                    req.flash('success_msg', "Tambah data berhasil");
                    res.redirect('/vote')
                })
                .catch((err) => {
                    console.log(err)
                    req.flash('error_msg', "Tambah data gagal");
                    res.redirect('/vote')
                })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    edit = async (req, res) => {
        const { id } = req.params
        try {
            const data = await model.vote.findOne({
                where: { id },
                include: [
                    { model: model.candidate, attributes: ['no_urut', 'name'] },
                    { model: model.tps, as: 'tps', attributes: ['no_tps', 'total_dpt'] }
                ]
            })
            if (data) {
                return res.render('vote/edit', {
                    title: 'Ubah Tempat Pemungutan Suara',
                    csrf: req.csrfToken(),
                    data
                })
            }
            return res.redirect('/vote')
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    change = async (req, res) => {
        const { id } = req.params
        const { numberOfVote, before, total_dpt, tpsId, male, female } = req.body
        try {
            const totalIn = await model.vote.sum('numberOfVote', { where: { tpsId } }) || 0
            const value = totalIn - parseInt(before)
            if ((value + parseInt(numberOfVote)) > parseInt(total_dpt)) {
                req.flash('error_msg', "Total suara melebihi kapasitas daftar pemilih tetap!");
                return res.redirect('/vote')
            }
            model.vote.update({ male, female, numberOfVote, userId: req.user.id }, { where: { id } })
                .then(() => {
                    req.flash('success_msg', "Ubah data berhasil");
                    res.redirect('/vote')
                })
                .catch((err) => {
                    console.log(err)
                    req.flash('error_msg', "Ubah data gagal");
                    res.redirect('/vote')
                })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    removeAll = (req, res) => {
        try {
            if (req.user.role == 'admin') {
                return res.redirect('/vote');
            }
            model.vote.destroy({ truncate: true, cascade: false })
                .then(() => {
                    req.flash('success_msg', "Reset data perhitungan berhasil");
                    res.redirect('/vote')
                })
                .catch((err) => {
                    console.log(err)
                    req.flash('error_msg', "Reset data perhitungan gagal");
                    res.redirect('/vote')
                })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

}
export default new VoteController()