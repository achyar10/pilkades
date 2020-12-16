import model from '../models'
import axios from 'axios'
import { Op } from 'sequelize'

class LandingController {

    index = async (req, res) => {
        const { districtId } = req.query
        try {
            const [tpsTotal, tpsVote, totalVote, votes, candidates, districts, invalidVote] = await Promise.all([
                model.tps.count({}),
                model.vote.count({ group: ['tpsId'] }),
                model.vote.sum('numberOfVote', { where: { candidateId: { [Op.not]: 1 } } }),
                model.vote.findAll({
                    where: { candidateId: { [Op.not]: 1 } },
                    attributes: [
                        'candidateId',
                        [model.Sequelize.fn('SUM', model.Sequelize.col('numberOfVote')), 'total_vote'],
                    ], group: ['candidateId'], raw: true
                }),
                model.candidate.findAll({ where: { id: { [Op.not]: 1 } }, attributes: ['id', 'no_urut', 'name', 'image'], order: [['no_urut', 'ASC']], raw: true, nest: true }),
                model.district.findAll({ attributes: ['id', 'name'] }),
                model.vote.sum('numberOfVote', { where: { candidateId: 1 } }),
            ])
            const tpsData = {
                total_tps: tpsTotal,
                tps_vote: tpsVote.length,
                percent: parseInt((tpsVote.length / tpsTotal) * 100)
            }
            let pie = []
            candidates.map(el => {
                let total_vote = 0
                for (const vote of votes) {
                    if (vote.candidateId == el.id) {
                        total_vote += parseInt(vote.total_vote)
                    }
                }
                el.total_vote = total_vote
                el.percent = parseFloat((total_vote / totalVote || 0) * 100).toFixed(2)
                pie.push({ name: `No Urut ${el.no_urut}`, y: el.percent })
            })
            const invalidPercent = parseFloat((invalidVote / totalVote || 0) * 100).toFixed(2)
            const hit = await axios.get(`http://${req.headers.host}/result/detail?districtId=${(districtId) ? districtId : ''}`)
            return res.render('landing', {
                title: `Portal ${res.locals.settings.app_name}`,
                layout: false,
                tpsData, candidates, totalVote: totalVote || 0, pie, invalidVote, invalidPercent,
                api: hit.data, districts,
                districtId
            })
        } catch (error) {
            console.log(error)
            res.redirect('/')
        }
    }

    timses = async (req, res) => {
        try {
            if (res.locals.settings.app_type === 'panitia') {
                return res.redirect('/')
            }
            return res.render('landing/timses', {
                title: `Portal ${res.locals.settings.app_name}`,
                layout: false
            })
        } catch (error) {
            console.log(error)
            res.redirect('/')
        }
    }

    detailCandidate = async (req, res) => {
        try {
            const [tpsTotal, tpsVote, totalVote, votes, candidates, invalidVote] = await Promise.all([
                model.tps.count({}),
                model.vote.count({ group: ['tpsId'] }),
                model.vote.sum('numberOfVote', { where: { candidateId: { [Op.not]: 1 } } }),
                model.vote.findAll({
                    where: { candidateId: { [Op.not]: 1 } },
                    attributes: [
                        'candidateId',
                        [model.Sequelize.fn('SUM', model.Sequelize.col('numberOfVote')), 'total_vote'],
                    ], group: ['candidateId'], raw: true
                }),
                model.candidate.findAll({ where: { id: { [Op.not]: 1 } }, attributes: ['id', 'no_urut', 'name', 'image'], order: [['no_urut', 'ASC']], raw: true, nest: true }),
                model.vote.sum('numberOfVote', { where: { candidateId: 1 } }),
            ])
            const tpsData = {
                total_tps: tpsTotal,
                tps_vote: tpsVote.length,
                percent: parseInt((tpsVote.length / tpsTotal) * 100)
            }
            const invalidPercent = parseFloat((invalidVote / totalVote || 0) * 100).toFixed(1)
            candidates.map(el => {
                let total_vote = 0
                for (const vote of votes) {
                    if (vote.candidateId == el.id) {
                        total_vote += parseInt(vote.total_vote)
                    }
                }
                el.total_vote = total_vote
                el.percent = parseFloat((total_vote / totalVote || 0) * 100).toFixed(1)
            })
            return res.json({
                candidates,
                totalVote: totalVote || 0,
                invalidPercent, invalidVote, tpsData
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json('Server error!')
        }
    }

    detail = async (req, res) => {
        try {
            const districts = await model.district.findAll({
                attributes: ['id', 'name'],
                include: [{ model: model.tps, as: 'tps', attributes: ['id', 'no_tps', 'total_dpt', 'plano'] }]
            })
            const candidates = await model.candidate.findAll({
                attributes: ['id', 'name', 'no_urut'],
                order: [['no_urut', 'ASC']]
            })
            const votes = await model.vote.findAll({
                attributes: ['tpsId', 'candidateId', 'numberOfVote']
            })

            let response = []
            let html = ''
            for (const d of districts) {
                let dataTps = []
                for (const tps of d.tps) {
                    let dataCan = [], total_suara_tps = 0
                    for (const c of candidates) {
                        let total_suara = 0
                        for (const v of votes) {
                            if (c.id == v.candidateId && tps.id == v.tpsId) {
                                total_suara += v.numberOfVote
                                total_suara_tps += v.numberOfVote
                            }
                        }
                        dataCan.push({ id: c.id, name: c.name, total_suara, percent: parseFloat((total_suara / tps.total_dpt) * 100).toFixed(2) })
                    }
                    dataTps.push({
                        no_tps: tps.no_tps,
                        total_dpt: tps.total_dpt,
                        absen: tps.total_dpt - total_suara_tps,
                        plano: tps.plano,
                        candidates: dataCan
                    })
                }
                response.push({ name: d.name, tps: dataTps })
            }

            return res.json(response)
        } catch (error) {
            console.log(error)
            res.status(500).json('Internal server error!')
        }
    }

    details = async (req, res) => {
        const { districtId } = req.query
        try {
            let query = {}
            if (districtId) query = { districtId }
            const tpss = await model.tps.findAll({
                where: query,
                as: 'tps',
                attributes: ['id', 'no_tps', 'total_dpt', 'plano'],
            })
            const candidates = await model.candidate.findAll({ attributes: ['id', 'name', 'no_urut'], order: [['no_urut', 'ASC']] })
            const votes = await model.vote.findAll({
                // where: { candidateId: { [Op.not]: 1 } },
                attributes: ['tpsId', 'candidateId', 'numberOfVote', 'male', 'female']
            })

            let dataTps = []
            for (const tps of tpss) {
                let dataCan = [], total_suara_tps = 0
                for (const c of candidates) {
                    let total_suara = 0, grand_total = 0, total_male = 0, total_female = 0
                    for (const v of votes) {
                        if (c.id == v.candidateId && tps.id == v.tpsId) {
                            total_suara += v.numberOfVote
                            total_suara_tps += v.numberOfVote
                            total_male += v.male
                            total_female += v.female
                        }
                        if (tps.id == v.tpsId && v.candidateId != 1) {
                            grand_total += v.numberOfVote
                        }
                    }
                    dataCan.push({ id: c.id, no_urut: c.no_urut, name: c.name, total_male, total_female, total_suara, grand_total, grand_total_percent: (grand_total > 0) ? 100 : '0.00', percent: parseFloat((total_suara / grand_total || 0) * 100).toFixed(2) })
                }
                dataTps.push({
                    no_tps: tps.no_tps,
                    total_dpt: tps.total_dpt,
                    total_suara: total_suara_tps,
                    absen: tps.total_dpt - total_suara_tps,
                    plano: tps.plano,
                    candidates: dataCan
                })
            }
            return res.json(dataTps)
        } catch (error) {
            console.log(error)
            res.status(500).json('Internal server error!')
        }
    }

    numberFormat = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

}
export default new LandingController()