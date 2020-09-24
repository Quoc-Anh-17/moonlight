const mongoose = require('mongoose')

const devSchema = mongoose.Schema({
    _id: String, 
    name: {
        type: String,
        required: true
    },
    log: {
        type: String,
        required: true
    }
}, {collection: "DevLog"})

module.exports = mongoose.model("DevLog", devSchema)