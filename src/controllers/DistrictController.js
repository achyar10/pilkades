import model from '../models'

class DistrictController {

    index = async (req, res) => {
        try {
            const data = await model.district.findAll({ raw: true })
            res.render('district', {
                title: 'Daftar Wilayah Pemilihan',
                data
            })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    add = (req, res) => {
        try {
            res.render('district/add', {
                title: 'Tambah Wilayah Pemilihan',
                csrf: req.csrfToken()
            })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    create = (req, res) => {
        try {
            model.district.create(req.body)
                .then(() => {
                    req.flash('success_msg', "Tambah data berhasil");
                    res.redirect('/district')
                })
                .catch((err) => {
                    console.log(err)
                    req.flash('error_msg', "Tambah data gagal");
                    res.redirect('/district')
                })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    edit = async (req, res) => {
        const { id } = req.params
        try {
            const data = await model.district.findOne({ where: { id } })
            if (data) {
                return res.render('district/edit', {
                    title: 'Ubah Tempat Pemungutan Suara',
                    csrf: req.csrfToken(),
                    data
                })
            }
            return res.redirect('/district')
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    change = (req, res) => {
        const { id } = req.params
        try {
            model.district.update(req.body, { where: { id } })
                .then(() => {
                    req.flash('success_msg', "Ubah data berhasil");
                    res.redirect('/district')
                })
                .catch((err) => {
                    console.log(err)
                    req.flash('error_msg', "Ubah data gagal");
                    res.redirect('/district')
                })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

}
export default new DistrictController()