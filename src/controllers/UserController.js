import model from '../models'
import bcrypt from 'bcrypt'
import { Op } from 'sequelize'

class UserController {

    index = async (req, res) => {
        try {
            const data = await model.user.findAll({ include: [{ model: model.tps, as: 'tps', attributes: ['no_tps'] }] })
            res.render('user', {
                title: 'Daftar Pengguna',
                data
            })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    add = async (req, res) => {
        try {
            const tps = await model.tps.findAll({})
            res.render('user/add', {
                title: 'Tambah Pengguna',
                csrf: req.csrfToken(),
                tps
            })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    create = (req, res) => {
        const { username, password, ...rest } = req.body
        try {
            model.user.create({ username: username.toLowerCase(), password: bcrypt.hashSync(password, 10), ...rest })
                .then(() => {
                    req.flash('success_msg', "Tambah data berhasil");
                    res.redirect('/user')
                })
                .catch((err) => {
                    console.log(err)
                    req.flash('error_msg', "Tambah data gagal");
                    res.redirect('/user')
                })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    edit = async (req, res) => {
        const { id } = req.params
        try {
            const tps = await model.tps.findAll({})
            const data = await model.user.findOne({ where: { id } })
            if (data) {
                return res.render('user/edit', {
                    title: 'Ubah Pengguna',
                    csrf: req.csrfToken(),
                    data, tps
                })
            }
            return res.redirect('/user')
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    change = (req, res) => {
        const { id } = req.params
        try {
            model.user.update(req.body, { where: { id } })
                .then(() => {
                    req.flash('success_msg', "Ubah data berhasil");
                    res.redirect('/user')
                })
                .catch((err) => {
                    console.log(err)
                    req.flash('error_msg', "Ubah data gagal");
                    res.redirect('/user')
                })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    cpw = async (req, res) => {
        try {
            res.render('user/cpw', {
                title: 'Ubah Password',
                id: req.params.id,
                csrf: req.csrfToken()
            })
        } catch (error) {
            res.redirect('/user')
        }
    }

    cpwProcess = (req, res) => {
        const { id } = req.params
        try {
            model.user.update({ password: bcrypt.hashSync(req.body.password, 10) }, { where: { id } })
                .then(() => {
                    req.flash('success_msg', "Ubah data berhasil");
                    res.redirect('/user')
                })
                .catch((err) => {
                    console.log(err)
                    req.flash('error_msg', "Ubah data gagal");
                    res.redirect('/user')
                })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    votes = async (req, res) => {
        try {
            const totalCandidate = await model.candidate.count()
            const raw = await model.user.findAll({
                where: { role: { [Op.ne]: 'superadmin' } },
                include: [{ model: model.tps, as: 'tps', attributes: ['no_tps'] }, { model: model.vote, as: 'votes', attributes: ['candidateId'] }],
                attributes: ['id', 'username', 'fullname'],
                order: [['fullname', 'ASC']]
            })
            const data = JSON.parse(JSON.stringify(raw))
            data.map(el => {
                el.desc = (el.votes.length == totalCandidate) ? 'Selesai' : `Masih kurang ${totalCandidate - el.votes.length} inputan`
            })
            return res.render('user/votes', {
                title: 'Hasil Perhitungan By Petugas',
                data
            })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

}
export default new UserController()