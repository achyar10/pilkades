import passport from 'passport'
class AuthController {

    getLogin = (req, res) => {
        res.render('login', {
            title: 'Login',
            layout: false,
            message: res.locals.error,
            csrf: req.csrfToken()
        })
    }

    doLogin = (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next)
    }

    logout = (req, res) => {
        req.logout();
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    }

}

export default new AuthController()