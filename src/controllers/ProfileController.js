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

    // cpw = (req, res) => {
    //     try {
    //         Users.findOneAndUpdate({ _id: req.user._id }, { $set: { password: bcrypt.hashSync(req.body.password, 10) } }, (err) => {
    //             if (err) {
    //                 res.redirect('/')
    //             }
    //             req.flash('success_msg', "Ubah sandi berhasil");
    //             res.redirect('/profile')
    //         })
    //     } catch (error) {
    //         res.redirect('/')
    //     }
    // }

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
            res.redirect('/profile')
        }
    }

    // editProcess = (req, res) => {
    //     try {
    //         Users.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true }, (err) => {
    //             if (err) {
    //                 res.redirect('/profile/edit')
    //             } else {
    //                 req.flash('success_msg', "Edit profile berhasil");
    //                 res.redirect('/profile')
    //             }
    //         })
    //     } catch (error) {
    //         res.redirect('/profile')
    //     }
    // }


}

export default new ProfileController