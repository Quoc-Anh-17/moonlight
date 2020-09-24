const router = require('express').Router();
const profile = require('../controllers/profileController')

router.post('/', profile.changeAvatar)

module.exports = router