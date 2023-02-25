const express = require('express')
const User = require('../model/user')
const authentification = require('../middlewares/authentification')
const router = new express.Router()

router.post('/users', async (req, res, next) => {
    const user = new User(req.body)

    try {
       const authToken = await user.generateAuthTokenAndSaveUser()
       const saveUser = await user.save();
        res.status(201).send({ user, authToken, saveUser });
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findUser(req.body.email, req.body.password);
        const authToken = await user.generateAuthTokenAndSaveUser();
        res.send({ user, authToken });
    } catch (error) {
        res.status(400).send('erreur vous ne pouvez pas vous connecter')
    }
})

router.post('/users/logout', authentification , async (req, res) => {
    try {
        req.user.authTokens = req.user.authTokens.filter((authToken) => {
            return authToken.authToken !== req.authToken
        })

        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send('impossible de se deconnecter')
    }
})

router.get('/users',  async (req, res, next) => {
    try {
        const user = await User.find({})
        if(!user) {
            return res.status(404).send('user not found')
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/users/me', authentification , async (req, res, next) => {
    res.send(req.user)
 })

router.patch('edit/users/:id', async (req, res, next) => {

    const updatedInfo = Object.keys(req.body)
    const userId = req.params.id

    try {
        const user = await User.findById(userId)
        updatedInfo.forEach(update => user[update] = req.body[update])
        await user.save()

        if(!user) {
            return res.status(404).send('user not found')
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/users/:id', async (req, res, next) => {
    const userId = req.params.id
    try {
        const user = await User.findByIdAndDelete(userId)
        
        if(!user) {
            return res.status(404).send('user not found')
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router