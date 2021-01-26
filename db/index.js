const { Pool } = require('pg')

var connectInfo = {}
var con_string


if (process.env.HEROKU) {
  con_string=process.env.DATABASE_URL
} else {
  connectInfo = {
    user: 'postgres',
    host: 'localhost',
    database: 'KurssiDB',
    password: 'FS2020sala',
    port: 5432,
  }
  con_string = 'tcp://'+connectInfo.user+':'+connectInfo.password+'@'+connectInfo.host+':'+connectInfo.port+'/'+connectInfo.database
}



const pool = new Pool({connectionString:con_string})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
  con_string: con_string
}