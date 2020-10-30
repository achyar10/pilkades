import model from '../models'

class LandingController {

    index = async (req, res) => {
        try {
            const [tpsTotal, tpsVote, totalVote, votes, candidates] = await Promise.all([
                model.tps.count({}),
                model.vote.count({ group: ['tpsId'] }),
                model.vote.sum('numberOfVote', {}),
                model.vote.findAll({
                    attributes: [
                        'candidateId',
                        [model.Sequelize.fn('SUM', model.Sequelize.col('numberOfVote')), 'total_vote'],
                    ], group: ['candidateId'], raw: true
                }),
                model.candidate.findAll({ where: {}, attributes: ['id', 'no_urut', 'name', 'image'], order: [['no_urut', 'ASC']], raw: true, nest: true })
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
                pie.push({ name: el.name, y: el.percent })
            })
            return res.render('landing', {
                title: 'Portal PILKADES Waringin Jaya',
                layout: false,
                tpsData, candidates, totalVote: totalVote || 0, pie
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

}
export default new LandingController()