const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
//const multer = require('multer')
const httpServer = require('http').createServer()
const io = require('socket.io')(httpServer, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"]
  }
})
const pg = require('pg')
require('./auth/auth')

var con_string = require('./db').con_string
//'tcp://postgres:FS2020sala@localhost:5432/KurssiDB';

var corsOptions = {
  origin: ['http://localhost:4000'],
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

app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io')) //static socket.io

app.use(express.static('./client/build'))

var pg_client = new pg.Client(con_string);
pg_client.connect();
var query = pg_client.query('LISTEN addedrecord');

io.sockets.on('connection', function (socket) {
  socket.emit('connected', { connected: true });

  socket.on('ready for data', function (data) {
    pg_client.on('notification', function (sqlMes) {
      //console.log("SQL notification: type: "+sqlMes.payload.type+" title: "+sqlMes.payload.nimi)
      console.log(sqlMes)
      socket.emit('update', { message: sqlMes });
    });
  });
});

//setInterval

httpServer.listen(9000)

app.use(passport.initialize())

const port = 4000

const routes = require('./routes/routes')
const secureRoutes = require('./routes/secureRoutes')
// notice here I'm requiring my database adapter file
// and not requiring node-postgres directly

app.use('/static', express.static(__dirname + '/files/')) //static files

app.use('/', routes)

app.use('/', passport.authenticate('jwt', { session: false }), secureRoutes);

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})