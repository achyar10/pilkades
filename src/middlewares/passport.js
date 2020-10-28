import model from '../models'
import bcrypt from 'bcrypt'
const LocalStrategy = require('passport-local').Strategy

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
            model.user.findOne({ where: { username } }).then(user => {
                if (!user) {
                    return done(null, false, { message: 'Username tidak terdaftar' })
                }
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err
                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'Password salah' })
                    }
                })
            })
        })
    )

    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function (id, done) {
        model.user.findOne({ where: { id } })
            .then(user => {
                if (user) {
                    const session = {
                        id: user.id,
                        username: user.username,
                        fullname: user.fullname,
                        role: user.role,
                    }
                    done(null, session)
                } else {
                    done(user.errors, null);
                }
            })
    })
}