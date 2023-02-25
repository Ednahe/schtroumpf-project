require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async() => {
    mongoose.connect('mongodb+srv://moi:test@cluster0.vqqjpzz.mongodb.net/?retryWrites=true&w=majority').then(() => {
        console.log('connexion à la base de donnée réalisé avec succès');
    }).catch((error) => console.log(error));
}

module.exports = {
    connectDB
}