const jwt = require('jsonwebtoken')
const User = require('../model/user')

const authentification = async (req, res, next) => {
    try {
        const authToken = req.header('Authorization').replace('Bearer ', '')
        const decodedToken = jwt.verify(authToken, 'test')
        const user = await User.findOne({ _id: decodedToken._id, 'authTokens.authToken': authToken })

        if(!user) {
            throw new Error;
        }
        req.authToken = authToken
        req.user = user
        next()
    } catch (error) {
        res.status(401).send('Merci de vous authentifier !')
    }
}

module.exports = authentification