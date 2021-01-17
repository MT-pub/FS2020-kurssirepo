const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
//const multer = require('multer')
require('./auth/auth')

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//var upload = multer()

const app = express()
app.use(cors(corsOptions))

//parses application/json
app.use(express.json())

//parses application/x-www-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//parses multipart/form-data
//app.use(upload.array())
app.use(express.static(__dirname + '/files')) //

app.use(passport.initialize())

const port = 4000

const routes = require('./routes/routes')
const secureRoutes = require('./routes/secureRoutes')
// notice here I'm requiring my database adapter file
// and not requiring node-postgres directly

app.use('/', routes)

app.use('/', passport.authenticate('jwt', { session: false }), secureRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})