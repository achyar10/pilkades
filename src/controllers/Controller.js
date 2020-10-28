import mongoose from 'mongoose'
import axios from 'axios'
require('dotenv').config()

class Controller {

    constructor(format = 'ascii') {
        this.format = format;
    }

    ObjectId = (param) => {
        return mongoose.Types.ObjectId(param)
    }

    chunk = (array, size) => {
        const chunked_arr = [];
        for (let i = 0; i < array.length; i++) {
            const last = chunked_arr[chunked_arr.length - 1];
            if (!last || last.length === size) {
                chunked_arr.push([array[i]]);
            } else {
                last.push(array[i]);
            }
        }
        return chunked_arr;
    }

    notification = async (batch = 'yes', token, title, desc) => {
        try {
            let config = {
                headers: {
                    'Authorization': process.env.NOTIF_KEY
                }
            }
            let send
            switch (batch) {
                case 'yes':
                    send = "registration_ids"
                    break;
                case 'no':
                    send = "to"
                    break;
                default:
                    send = "to"
                    break;
            }
            let data = {
                [send]: token,
                notification: {
                    title: title,
                    body: desc,
                    vibrate: 0,
                    sound: 0
                }
            }
            const URL = process.env.URL_FCM
            await axios.post(URL, data, config)
        } catch (e) {
            console.log(e)
        }
    }

    encode(data) {
        return new Buffer.from(data).toString('base64');
    }

    decode(data) {
        let buffer = new Buffer.from(data, 'base64');
        if (this.format == 'buffer') return buffer;
        return buffer.toString(this.format);
    }


}

export default Controller