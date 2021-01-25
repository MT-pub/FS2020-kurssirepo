const { Pool } = require('pg')

var connectInfo = {}

if (process.env.HEROKU) {
  connectInfo = {

  }
} else {
  connectInfo = {
    user: 'postgres',
    host: 'localhost',
    database: 'KurssiDB',
    password: 'FS2020sala',
    port: 5432,
  }
}

const pool = new Pool(connectInfo)

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}