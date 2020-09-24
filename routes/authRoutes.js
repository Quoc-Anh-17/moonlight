const router = require('express').Router();
const User = require('../models/User')
const auth = require('../controllers/authControllers')
const jwt = require('jsonwebtoken')
router.post('/login', auth.postLogin)
router.post('/signup', auth.postSignup)
router.get('/delete', auth.getDelete)
router.get('/getall', auth.getUsers)
router.get('/logout', auth.getLogout)
router.get('/confirmation/self/:token', (req, res) => {
    jwt.verify(req.params.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            res.json({message: "token is expired"})
        }
        else {
            let user = await User.findByIdAndUpdate(data.id, {verified: true})
            if (user.verified && user.verifiedcompany) {
                clearTimeout(user.id);
            }
            res.redirect('/')
        }
    })
})
router.get('/confirmation/staff/:token', (req, res) => {
    jwt.verify(req.params.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            res.json({message: "token is expired"})
        }
        else {
            let user = await User.findByIdAndUpdate(data.id, {verifiedcompany: true})
            if (user.verified && user.verifiedcompany) {
                clearTimeout(user.id);
            }
            res.redirect('/')
        }
    })
})

module.exports = router