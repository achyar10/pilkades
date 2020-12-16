import bcrypt from 'bcrypt'
import model from '../models'

class ProfileController {

    get = async (req, res) => {
        const user = await model.user.findOne({ where: { id: req.user.id } })
        res.render('profile', {
            title: 'Profil',
            data: user,
            csrf: req.csrfToken(),
            message: req.flash('error')
        })
    }

    cpw = async (req, res) => {
        try {
            const update = await model.user.update({ password: bcrypt.hashSync(req.body.password, 10) }, { where: { id: req.user.id } })
            if (update[0] == 1) {
                req.flash('success_msg', "Ubah sandi berhasil");
                return res.redirect('/profile')
            }
            return res.redirect('/profile')
        } catch (error) {
            res.redirect('/vote')
        }
    }

    edit = async (req, res) => {
        try {
            const get = await model.user.findOne({ where: { id: req.user.id } })
            if (!get) {
                res.redirect('/profile')
            } else {
                res.render('profile/edit', {
                    title: 'Ubah Profile',
                    data: get,
                    csrf: req.csrfToken()
                })
            }
        } catch (error) {
            console.log(error)
            res.redirect('/profile')
        }
    }

    editProcess = async (req, res) => {
        try {
            const update = await model.user.update({ fullname: req.body.fullname }, { where: { id: req.user.id } })
            if (update[0] == 1) {
                req.flash('success_msg', "Ubah data berhasil");
                return res.redirect('/profile')
            }
            return res.redirect('/profile')
        } catch (error) {
            console.log(error)
            res.redirect('/profile')
        }
    }


}

export default new ProfileController