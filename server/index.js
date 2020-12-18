const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
require('./auth/auth')

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
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