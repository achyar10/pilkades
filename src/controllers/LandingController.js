import model from '../models'
import axios from 'axios'

class LandingController {

    index = async (req, res) => {
        try {
            const [tpsTotal, tpsVote, totalVote, votes, candidates, districts] = await Promise.all([
                model.tps.count({}),
                model.vote.count({ group: ['tpsId'] }),
                model.vote.sum('numberOfVote', {}),
                model.vote.findAll({
                    attributes: [
                        'candidateId',
                        [model.Sequelize.fn('SUM', model.Sequelize.col('numberOfVote')), 'total_vote'],
                    ], group: ['candidateId'], raw: true
                }),
                model.candidate.findAll({ where: {}, attributes: ['id', 'no_urut', 'name', 'image'], order: [['no_urut', 'ASC']], raw: true, nest: true }),
                model.district.findAll({ attributes: ['id', 'name'] })
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
                pie.push({ name: (el.no_urut == 99 ? el.name : `No Urut ${el.no_urut}`), y: el.percent })
            })
            const invalidVote = candidates[candidates.length - 1].total_vote, invalidPercent = candidates[candidates.length - 1].percent
            const hit = await axios.get(`http://${req.headers.host}/result/detail`)
            return res.render('landing', {
                title: 'Portal PILKADES Waringin Jaya',
                layout: false,
                tpsData, candidates, totalVote: totalVote || 0, pie, invalidVote, invalidPercent,
                api: hit.data, districts
            })
        } catch (error) {
            console.log(error)
            res.redirect('/')
        }
    }

    detail = async (req, res) => {
        try {
            const districts = await model.district.findAll({
                attributes: ['id', 'name'],
                include: [{ model: model.tps, as: 'tps', attributes: ['id', 'no_tps', 'total_dpt', 'plano'] }]
            })
            const candidates = await model.candidate.findAll({ attributes: ['id', 'name', 'no_urut'], order: [['no_urut', 'ASC']] })
            const votes = await model.vote.findAll({ attributes: ['tpsId', 'candidateId', 'numberOfVote'] })

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

    tes2 = async (req, res) => {
        try {
            const districts = await model.district.findAll({
                attributes: ['id', 'name'],
                include: [{ model: model.tps, as: 'tps', attributes: ['id', 'no_tps', 'total_dpt', 'plano'] }]
            })
            const candidates = await model.candidate.findAll({ attributes: ['id', 'name', 'no_urut'], order: [['no_urut', 'ASC']] })
            const votes = await model.vote.findAll({ attributes: ['tpsId', 'candidateId', 'numberOfVote'] })

            let response = []
            for (const d of districts) {
                for (const tps of d.tps) {
                    for (const c of candidates) {
                        let total_suara = 0
                        for (const v of votes) {
                            if (c.id == v.candidateId && tps.id == v.tpsId) {
                                total_suara += v.numberOfVote
                            }
                        }
                        response.push({
                            district: d.name,
                            tps: tps.no_tps,
                            total_dpt: tps.total_dpt,
                            plano: tps.plano,
                            id: c.id,
                            name: c.name,
                            total_suara,
                            percent: parseFloat((total_suara / tps.total_dpt) * 100).toFixed(2)
                        })
                    }
                }
            }

            return res.json(response)
        } catch (error) {
            console.log(error)
            res.status(500).json('Internal server error!')
        }
    }

    tes3 = async (req, res) => {
        try {
            const tpss = await model.tps.findAll({
                as: 'tps',
                attributes: ['id', 'no_tps', 'total_dpt', 'plano'],
            })
            const candidates = await model.candidate.findAll({ attributes: ['id', 'name', 'no_urut'], order: [['no_urut', 'ASC']] })
            const votes = await model.vote.findAll({ attributes: ['tpsId', 'candidateId', 'numberOfVote'] })

            let dataTps = []
            for (const tps of tpss) {
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
                    total_suara: total_suara_tps,
                    absen: tps.total_dpt - total_suara_tps,
                    plano: tps.plano,
                    candidates: dataCan
                })
            }
            let html = ''
            for (const row of dataTps) {
                html += '<tr>'
                let jmlCalon = row.candidates.length
                html += `<td rowspan="${jmlCalon}">${row.no_tps}</td>`
                for (const t of row.candidates) {
                    html += `<td>${t.name}</td>
                            <td>${this.numberFormat(t.total_suara)} dari ${this.numberFormat(row.total_dpt)}</td>
                            <td>${t.percent}%</td>
                    </tr>`
                }
            }

            let fullHtml = /*html*/ `<table border="1">
            <tr>
                <th>TPS</th>
                <th>Calon</th>
                <th>Total Suara</th>
                <th>Persentase</th>
            </tr>
            ${html}
            </table>`

            return res.send(fullHtml)
        } catch (error) {
            console.log(error)
            res.status(500).json('Internal server error!')
        }
    }

    details = async (req, res) => {
        try {
            const tpss = await model.tps.findAll({
                as: 'tps',
                attributes: ['id', 'no_tps', 'total_dpt', 'plano'],
            })
            const candidates = await model.candidate.findAll({ attributes: ['id', 'name', 'no_urut'], order: [['no_urut', 'ASC']] })
            const votes = await model.vote.findAll({ attributes: ['tpsId', 'candidateId', 'numberOfVote'] })

            let dataTps = []
            for (const tps of tpss) {
                let dataCan = [], total_suara_tps = 0
                for (const c of candidates) {
                    let total_suara = 0, grand_total = 0
                    for (const v of votes) {
                        if (c.id == v.candidateId && tps.id == v.tpsId) {
                            total_suara += v.numberOfVote
                            total_suara_tps += v.numberOfVote
                        }
                        if (tps.id == v.tpsId) {
                            grand_total += v.numberOfVote
                        }
                    }
                    dataCan.push({ id: c.id, no_urut: c.no_urut, name: c.name, total_suara, percent: parseFloat((total_suara / grand_total || 0) * 100).toFixed(2) })
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