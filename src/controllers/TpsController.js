import model from '../models'

class TpsController {

    index = async (req, res) => {
        try {
            const data = await model.tps.findAll({ raw: true })
            res.render('tps', {
                title: 'Daftar Tempat Pemungutan Suara',
                data
            })
        } catch (error) {
            console.log(error)
            res.redirect('/')
        }
    }

    add = (req, res) => {
        try {
            res.render('tps/add', {
                title: 'Tambah Tempat Pemungutan Suara',
                csrf: req.csrfToken()
            })
        } catch (error) {
            console.log(error)
            res.redirect('/')
        }
    }

    create = (req, res) => {
        try {
            model.tps.create(req.body)
                .then(() => {
                    req.flash('success_msg', "Tambah data berhasil");
                    res.redirect('/tps')
                })
                .catch((err) => {
                    console.log(err)
                    req.flash('error_msg', "Tambah data gagal");
                    res.redirect('/tps')
                })
        } catch (error) {
            console.log(error)
            res.redirect('/')
        }
    }

    edit = async (req, res) => {
        const { id } = req.params
        try {
            const data = await model.tps.findOne({ where: { id } })
            if (data) {
                return res.render('tps/edit', {
                    title: 'Ubah Tempat Pemungutan Suara',
                    csrf: req.csrfToken(),
                    data
                })
            }
            return res.redirect('/tps')
        } catch (error) {
            console.log(error)
            res.redirect('/')
        }
    }

    change = (req, res) => {
        const { id } = req.params
        try {
            model.tps.update(req.body, { where: { id } })
                .then(() => {
                    req.flash('success_msg', "Ubah data berhasil");
                    res.redirect('/tps')
                })
                .catch((err) => {
                    console.log(err)
                    req.flash('error_msg', "Ubah data gagal");
                    res.redirect('/tps')
                })
        } catch (error) {
            console.log(error)
            res.redirect('/')
        }
    }

}
export default new TpsController()