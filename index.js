const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
//const multer = require('multer')
const path = require('path')

const pg = require('pg')
require('./auth/auth')

var con_string = require('./db').con_string
//'tcp://postgres:FS2020sala@localhost:5432/KurssiDB';

const port = process.env.PORT || 4000



var corsOptions = null

if (process.env.HEROKU) {
  corsOptions = {
    origin: ['*'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
}
else {
  corsOptions = {
    origin: ['http://localhost:3000'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
}

//var upload = multer()

const app = express()
app.use(cors(corsOptions))

/* const httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"]
  }
}) */

//const io = require('socket.io')(app)

//parses application/json
app.use(express.json())

//parses application/x-www-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//parses multipart/form-data
//app.use(upload.array())

//app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io')) //static socket.io

app.use(express.static('./client/build'))

/* var pg_client = new pg.Client(con_string);
pg_client.connect();
var query = pg_client.query('LISTEN addedrecord');

io.sockets.on('connection', function (socket) {
  console.log("connected")
  socket.emit('connected', { connected: true });

  socket.on('ready for data', function (data) {
    pg_client.on('notification', function (sqlMes) {
      //console.log("SQL notification: type: "+sqlMes.payload.type+" title: "+sqlMes.payload.nimi)
      console.log(sqlMes)
      socket.emit('update', { message: sqlMes });
    });
  });
}); */

//setInterval

//httpServer.listen(9000)

app.use(passport.initialize())




const routes = require('./routes/routes')
const secureRoutes = require('./routes/secureRoutes')
// notice here I'm requiring my database adapter file
// and not requiring node-postgres directly

app.use('/static', express.static(__dirname + '/files/')) //static files

app.use('/', routes)

app.use('/', passport.authenticate('jwt', { session: false }), secureRoutes);

app.use('*', (req, res) => {
  console.log("tässänäin")
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})