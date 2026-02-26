const isLoggedIn = function (req, res, next) {
    if(!req.session.userId) {
        const error = "Please login first!"
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
}

const isTeacher = function (req, res, next) {
    if(req.session.userId && req.session.role !== "teacher") {
        const error = "You have no access"
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
}

module.exports = { isLoggedIn, isTeacher }