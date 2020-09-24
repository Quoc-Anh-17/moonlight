const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 6
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: '/logo.png'
    },
    verified: {
        type: Boolean,
        default: false
    },
    verifiedcompany: {
        type: Boolean,
        default: false
    },
    company: {
        name: {
            type: String,
            required: true
        },
        taxcode: {
            type: String,
            required: true
        }
    },
    founder: {
        type: Boolean,
        required: true,
    }
}, {collection: 'HexagonUser'})
let day = 1000*60*60*24*3
userSchema.pre('save', async function(next) {
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
    const id = setTimeout(async () => {
        const document = await User.findById(this._id)
        await document.remove()
    }, day)
    this.timerId = id
    console.log('New user created')
    next();
})

//Custom function for user model
userSchema.statics.login = async function(email, password) {
    const user = await User.findOne({ email })
    if (user) {
        let auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user;
        }
        throw Error("Incorrect password")
    }
    throw Error("Email not found")
}
userSchema.statics.signup = async function (email, name, password, founder, companyname, companytax) {
    if (founder) {
        const exfounder = await User.findOne({"company.taxcode" : companytax, founder: true})
        if (exfounder) {
            throw Error("This company already had a founder")
        } else {
            const user = await User.create({
                email: email,
                name: name,
                password: password,
                founder:founder,
                company: {
                    name: companyname,
                    taxcode: companytax
                },
                verifiedcompany: true
            })

            return user
        }
    }
    else {
        const cname = await User.findOne({"company.taxcode" : companytax})
        if (!cname) {
            throw Error("Company not found")
        } else {
            const user = await User.create({
                email: email,
                name: name,
                password: password,
                founder:founder,
                company: {
                    name: cname.company.name,
                    taxcode: companytax
                }
            })
            return user
        }
    }
}
const User = mongoose.model('User', userSchema)

module.exports = User