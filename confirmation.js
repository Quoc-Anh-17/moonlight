const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }});

module.exports.selfVerify = async (receiver, token) => {
    let info  = await transporter.sendMail({
        from: "Hexagon",
        to: receiver,
        subject: "[Hexagonia] Email Confirmation",
        text: `Please click the following link to confirm your email https://hexagon-moon-light.herokuapp.com/api/confirmation/self/${token}`
    })
}
module.exports.staffVerify = async (receiver, token) => {
    let info = await transporter.sendMail({
        from: "Hexagon",
        to: receiver,
        subject: "[Hexagonia] Staff Registeration Confirmation",
        text: `Please confirm this person as a staff of your company by clicking on the following link https://hexagon-moon-light.herokuapp.com/api/confirmation/self/${token}`
    })
}
