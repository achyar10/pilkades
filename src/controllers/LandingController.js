import model from '../models'

class LandingController {

    index = async (req, res) => {
        try {
            const joinCandidate = [{
                model: model.vote, as: 'votes',
                attributes: [[model.Sequelize.fn('SUM', model.Sequelize.col('numberOfVote')), 'total_vote'],],
                group: ['candidateId']
            }]
            const [tpsTotal, tpsVote, totalVote, candidate] = await Promise.all([
                model.tps.count({}),
                model.vote.count({ group: ['tpsId'] }),
                model.vote.sum('numberOfVote', {}),
                model.candidate.findAll({ where: { isBlank: false }, attributes: ['no_urut', 'name', 'image'], order: [['no_urut', 'ASC']], include: joinCandidate, raw: true, nest: true })
            ])
            const tpsData = {
                total_tps: tpsTotal,
                tps_vote: tpsVote.length,
                percent: parseInt((tpsVote.length / tpsTotal) * 100)
            }
            candidate.map(el => {
                el.percent = parseFloat((parseInt(el.votes.total_vote) / totalVote) * 100).toFixed(2)
            })
            return res.render('landing', {
                title: 'Portal PILKADES Waringin Jaya',
                layout: false,
                tpsData, candidate, totalVote
            })
        } catch (error) {
            console.log(error)
            res.redirect('/')
        }
    }

}
export default new LandingController()