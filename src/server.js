import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import flash from 'connect-flash'
import session from 'express-session'
import expbs from 'express-handlebars'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import passport from 'passport'
import tplHelpers from './helpers/tplHelper'
import fileUpload from 'express-fileupload'
import model from './models'
import routes from './routers'
require('dotenv').config()
require('./middlewares/passport')(passport);
const MySQLStore = require('express-mysql-session')(session);

const app = express()

app.use(cors())
app.use(compression())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(fileUpload({
    useTempFiles: true
}))
app.use(cookieParser())

app.use(express.static('public'))
model.sequelize.sync({ force: false, alter: true })
app.engine('hbs', expbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    partialsDir: 'views/layouts',
    extname: 'hbs',
    helpers: tplHelpers
}))
app.set('view engine', 'hbs')

app.use(session({
    store: new MySQLStore({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME
    }),
    secret: 'rahasia',
    resave: false,
    saveUninitialized: false
}))

// Passport config
app.use(passport.initialize());
app.use(passport.session());

//security
app.use(helmet())
app.use(csrf())
app.use(flash())

// Global variables
app.use(function (req, res, next) {
    res.locals.user = req.user
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
    res.redirect('back')
})

app.use('/', routes)

app.use((req, res, next) => {
    res.render('errors/404', { layout: false })
})

const PORT = process.env.PORT || 9090
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})


