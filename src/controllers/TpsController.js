import model from '../models'
import { v2 } from 'cloudinary'
class TpsController {

    constructor() {
        v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_KEY,
            api_secret: process.env.CLOUD_SECRET
        });
    }

    index = async (req, res) => {
        try {
            const data = await model.tps.findAll({ include: [{ model: model.district, attributes: ['name'] }] })
            res.render('tps', {
                title: 'Daftar Tempat Pemungutan Suara',
                data
            })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    add = async (req, res) => {
        try {
            const districts = await model.district.findAll({})
            res.render('tps/add', {
                title: 'Tambah Tempat Pemungutan Suara',
                csrf: req.csrfToken(),
                districts
            })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
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
            res.redirect('/dashboard')
        }
    }

    edit = async (req, res) => {
        const { id } = req.params
        try {
            const districts = await model.district.findAll({})
            const data = await model.tps.findOne({ where: { id } })
            if (data) {
                return res.render('tps/edit', {
                    title: 'Ubah Tempat Pemungutan Suara',
                    csrf: req.csrfToken(),
                    data, districts
                })
            }
            return res.redirect('/tps')
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    change = async (req, res) => {
        const { id } = req.params
        try {
            let updated = req.body
            if (req.files.plano.name !== '') {
                const nameImage = new Date().getTime()
                const upload = await v2.uploader.upload(req.files.plano.tempFilePath, {
                    folder: 'pilkades/plano',
                    quality: "auto:low",
                    public_id: nameImage,
                    format: 'png',
                    overwrite: true
                })
                updated = { ...updated, plano: upload.secure_url }
            }
            model.tps.update(updated, { where: { id } })
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
            res.redirect('/dashboard')
        }
    }

}
export default new TpsController()