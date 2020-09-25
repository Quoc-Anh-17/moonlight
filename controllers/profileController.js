const multer  = require('multer')
const User = require('../models/User')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './resource/avatar')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.id + ".png")
    }
})
const upload = multer({ storage }).single('avatar')

module.exports.changeAvatar = async (req, res) => {
    upload(req, res, async (err) => {
        await User.findByIdAndUpdate(req.body.id, {avatar: '/resource/avatar/' + req.file.filename})
        res.json({avatar: '/resource/avatar/' + req.file.filename})
    });
}

