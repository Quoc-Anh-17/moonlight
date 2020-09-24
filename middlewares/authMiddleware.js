const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.hexentoken

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
            if (err) {
                res.redirect('/')
            }
            else {
                next()
            }
        })
    }
    else {
        res.redirect('/')
    }
}
module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.hexentoken

    if(token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if(err) {
                res.locals.user = null
                next();
            }
            else {
                let user = await User.findById(decoded.id)
                res.locals.user = user
                next()
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}