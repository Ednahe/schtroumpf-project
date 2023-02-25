const express = require('express')
const app = express()
const userRoutes = require('./route/route')
const { connectDB } = require('./db/connect')
const cors = require('cors')

app.use(express.static(__dirname + '/app//script'));

const port = process.env.PORT || 3000
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

connectDB().catch(err => console.log(err))

app.use(cors())
app.use(express.json())
app.use(userRoutes)

// app.use('/app/script', express.static(__dirname + '/app/script', {
//     setHeaders: function (res, path) {
//       if (path.endsWith('.js')) {
//         res.setHeader('Content-Type', 'application/javascript');
//       }
//     }
// }));

app.use(express.static('view'))

app.listen(port, () => {
    console.log(`connexion au port ${port} réalisé avec succès`);
})