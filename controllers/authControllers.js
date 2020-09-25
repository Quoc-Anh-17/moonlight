const jwt = require('jsonwebtoken')
const User = require('../models/User')
const mail = require('../confirmation')
const maxAge = 3600 * 60 * 24
function createToken(id) {
    return jwt.sign({id}, process.env.SECRET_KEY, {expiresIn: maxAge})
}
const handleError = (err) => {
    let errors = {email: '', password: '', company: ''}

    //incorrect email
    if (err.message === "Email not found") {
        errors.email = "Email is not registered"
    }
    //incorrect password
    if (err.message === "Incorrect password") {
        errors.password = "Password is incorrect"
    }
    if (err.message === "This company already had a founder") {
        errors.company = "This company already had a founder"
    }
    if (err.message === "Company not found") {
        errors.company = "Company not found"
    }

    //duplicate error code
    if (err.code === 11000) {
        errors.email = 'Email is taken!'
        return errors
    }
    //validate errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            if (properties.path == 'email') {
                errors[properties.path] = 'Email must be at least 6 characters'
            }
            else if (properties.path == 'password') {
                errors[properties.path] = 'Password must be at least 6 characters'
            }
        })
    }
    return errors
}
//Official api
module.exports.postSignup = async (req, res) => {
    let {email, name, password, founder, companyname, companytax} = req.body
    try {
        const user = await User.signup(email, name, password, founder, companyname, companytax)
        const token = createToken(user._id);
        res.cookie('hexentoken', token, {httpOnly: true, maxAge: maxAge*1000})
        mail.selfVerify(user.email, token)
        if (!founder) {
            const cfounder = await User.findOne({"company.taxcode" : companytax})
            mail.staffVerify(cfounder.email, token) 
        }
        res.status(200).json({user});
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({errors})
    }
}
module.exports.postLogin = async (req, res) => {
    let {email, password} = req.body
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('hexentoken', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user});
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({errors})
    }
}
module.exports.getLogout = async (req, res) => {
    res.cookie('hexentoken', '', {maxAge: 1})
    res.status(200).send('Logout successfully')
}
module.exports.getAuth = async (req, res) => {
    const token = req.cookies.hexentoken
    console.log("Someone access")
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
            if (err) {
                res.json({message: "unauthenticated"})
            }
            else {
                const user = await User.findById(data.id)
                res.cookie('hexentoken', token, {httpOnly: true, maxAge: maxAge * 1000});
                res.status(200).json({user});
            }
        })
    }
    else {
        res.json({message: "unauthenticated"})
    }
}
//Support api
module.exports.getSeeData = async (req, res) => {
    res.send("Hello " + res.locals.username + "! Here's some secret datas")
}
module.exports.getUsers = async (req, res) => {
    const users = await User.find()
    res.status(200).json(users)
}
module.exports.getDelete = async (req, res) => {
    await User.deleteMany()
    res.send("All users removed")
}