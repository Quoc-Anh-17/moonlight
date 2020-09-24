const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const path = require('path')
const app = express();
const {requireAuth} = require('./middlewares/authMiddleware')
require('dotenv').config()
const PORT = process.env.PORT || 8080

//Routers
const authRoutes = require('./routes/authRoutes.js')
const profileRoutes = require('./routes/profileRoutes.js')
const devRoutes = require('./routes/devRoutes.js')

//Routing
app.use(cookieParser())
app.use(express.json())
app.use(express.static('./build'))

//Private static resource
app.use('/resource', requireAuth, express.static('./resource'))

//Login, signup, logout
app.use('/api', authRoutes)

//Change avatar
app.use('/profile', profileRoutes)

app.use('/dev', devRoutes)
//Redirect to app
app.get('/*', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })
  
//Connect to database
mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},
    () => console.log('Connected to database'))

//Listen on port
app.listen(PORT, () => console.log('Server is running'))