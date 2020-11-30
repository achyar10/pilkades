import model from '../models'
import { Op } from 'sequelize'
class HomeController {

    index = async (req, res) => {
        try {
            if (req.user.role == 'admin') {
                return res.redirect('/vote');
            }
            const [candidate, tps, invalid, valid] = await Promise.all([
                model.candidate.count({ where: { isBlank: false } }),
                model.tps.count({}),
                model.vote.sum('numberOfVote', { where: { candidateId: 1 } }),
                model.vote.sum('numberOfVote', { where: { candidateId: { [Op.ne]: 1 } } }),
            ])
            res.render('home', {
                title: 'Dashboard',
                candidate, tps, invalid, valid
            })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

}

export default new HomeController()