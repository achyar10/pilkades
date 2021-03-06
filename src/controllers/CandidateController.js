import model from '../models'
import { v2 } from 'cloudinary'

class CandidateController {

    constructor() {
        v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_KEY,
            api_secret: process.env.CLOUD_SECRET
        });
    }

    index = async (req, res) => {
        try {
            const data = await model.candidate.findAll({
                where: { isBlank: false },
                order: [['no_urut', 'ASC']],
                raw: true
            })
            res.render('candidate', {
                title: 'Daftar Calon',
                data
            })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    add = (req, res) => {
        try {
            res.render('candidate/add', {
                title: 'Tambah Tempat Pemungutan Suara',
                csrf: req.csrfToken()
            })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    create = async (req, res) => {
        const { image, ...rest } = req.body
        try {
            const nameImage = new Date().getTime()
            const upload = await v2.uploader.upload(req.files.image.tempFilePath, {
                folder: 'pilkades/candidate',
                quality: "auto:low",
                public_id: nameImage,
                format: 'png',
                overwrite: true,
                width: 300, height: 300, crop: "fill"
            })
            model.candidate.create({
                image: upload.secure_url, ...rest
            })
                .then(() => {
                    req.flash('success_msg', "Tambah data berhasil");
                    res.redirect('/candidate')
                })
                .catch((err) => {
                    console.log(err)
                    req.flash('error_msg', "Tambah data gagal");
                    res.redirect('/candidate')
                })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    edit = async (req, res) => {
        const { id } = req.params
        try {
            const data = await model.candidate.findOne({ where: { id } })
            if (data) {
                return res.render('candidate/edit', {
                    title: 'Ubah Data Calon',
                    csrf: req.csrfToken(),
                    data
                })
            }
            return res.redirect('/candidate')
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    change = async (req, res) => {
        const { id } = req.params
        try {
            let updated = req.body
            if (req.files.image.name !== '') {
                const nameImage = new Date().getTime()
                const upload = await v2.uploader.upload(req.files.image.tempFilePath, {
                    folder: 'pilkades/candidate',
                    quality: "auto:low",
                    public_id: nameImage,
                    format: 'png',
                    overwrite: true,
                    width: 300, height: 300, crop: "fill"
                })
                updated = { ...updated, image: upload.secure_url }
            }
            model.candidate.update(updated, { where: { id } })
                .then(() => {
                    req.flash('success_msg', "Ubah data berhasil");
                    res.redirect('/candidate')
                })
                .catch((err) => {
                    console.log(err)
                    req.flash('error_msg', "Ubah data gagal");
                    res.redirect('/candidate')
                })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

}
export default new CandidateController()