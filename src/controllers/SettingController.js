import model from '../models'
import { v2 } from 'cloudinary'

class SettingController {

    constructor() {
        v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_KEY,
            api_secret: process.env.CLOUD_SECRET
        });
    }

    index = async (req, res) => {
        try {
            const data = await model.setting.findOne({ where: { id: 1 }, raw: true })
            res.render('setting', {
                title: 'Pengaturan',
                csrf: req.csrfToken(),
                data
            })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

    change = async (req, res) => {
        try {
            let updated = req.body
            if (req.files.app_logo.name !== '') {
                const nameImage = new Date().getTime()
                const upload = await v2.uploader.upload(req.files.app_logo.tempFilePath, {
                    folder: 'pilkades/logo',
                    quality: "auto:low",
                    public_id: nameImage,
                    format: 'png',
                    overwrite: true,
                    width: 512, height: 512, crop: "fill"
                })
                updated = { ...updated, app_logo: upload.secure_url }
            }
            model.setting.update(updated, { where: { id: 1 } })
                .then(() => {
                    req.flash('success_msg', "Ubah data berhasil");
                    res.redirect('/setting')
                })
                .catch((err) => {
                    console.log(err)
                    req.flash('error_msg', "Ubah data gagal");
                    res.redirect('/setting')
                })
        } catch (error) {
            console.log(error)
            res.redirect('/dashboard')
        }
    }

}
export default new SettingController()