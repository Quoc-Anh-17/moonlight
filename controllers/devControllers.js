const DevLog = require('../models/DevLog')

//Get all the log
module.exports.getLog = async (req, res) => {
    let logs = await DevLog.find({name: req.body.name})
    res.json({logs})
}
//Post a log
module.exports.postLog = async (req, res) => {
    let {id, name, log} = req.body
    let newlog = new DevLog({_id: id, name, log})
    await newlog.save()
    res.json({message: "Post successfully"})
}
//Delete a log
module.exports.deleteLog = async (req, res) => {
    let {id} = req.body
    if (id) {
        const logs = await DevLog.findByIdAndDelete(id)
        res.json({logs})
    }
    else {
        await DevLog.deleteMany()
        res.json({message: "Delete everything"})
    }
}