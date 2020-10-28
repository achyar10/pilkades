module.exports = {
    isAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash('error_msg', 'Please log in to view that resource');
        res.redirect('/login');
    },
    isLogin: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next()
        }
        res.redirect('/');
    },
    isAdmin: function (req, res, next) {
        if (req.user.role == 'admin') {
            return next();
        }
        res.redirect('/')
    },
    isSuperAccess: function (req, res, next) {
        return next();
        res.redirect('/')
    }
};