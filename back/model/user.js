const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const schtroumpfs = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        valide(v) {
            if (!validator.isEmail(v)) {
                throw new Error ('Email non valide')
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(v) {
            if (!validator.isLength(v, { min: 4, max: 20 } )) {
                throw new Error ('Le mot de passe doit contenir entre 4 et 20 caractères')
            }
        }
    },
    authTokens: [{
        authToken: {
            type: String,
            required: true
        }
    }]
})

schtroumpfs.methods.generateAuthTokenAndSaveUser = async function () {
    const authToken = jwt.sign({ _id: this._id.toString() }, 'test')
    this.authTokens.push({ authToken })
    // await this.save() 
    return authToken
}

schtroumpfs.statics.findUser = async(email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Erreur, impossible de se connecter')
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new Error('Erreur, impossible de se connecter')
    }
    return user
}

schtroumpfs.pre('save', async function() {
    if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 8)
})

const User = mongoose.model('users',schtroumpfs)

module.exports = User