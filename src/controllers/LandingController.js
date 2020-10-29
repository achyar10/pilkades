import model from '../models'

class LandingController {

    index = async (req, res) => {
        try {
            const joinCandidate = [{
                model: model.vote, as: 'votes',
                attributes: [[model.Sequelize.fn('SUM', model.Sequelize.col('numberOfVote')), 'total_vote'],],
                // group: ['vote.candidateId']
            }]
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
                model.candidate.findAll({ where: { isBlank: false }, attributes: ['id', 'no_urut', 'name', 'image'], order: [['no_urut', 'ASC']], raw: true, nest: true })
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

}
export default new LandingController()