const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
const port = 4000

// notice here I'm requiring my database adapter file
// and not requiring node-postgres directly
const db = require('./db')
app.get('/:id', (req, res, next) => {
  db.query('SELECT * FROM tentti WHERE id = $1', [req.params.id], (err, dbres) => {
    if (err) {
      return next(err)
    }
    res.send(dbres.rows[0])
  })
})
// ... many other routes in this file

/* app.get('/', (req, res) => {
  res.send('Hello World!GET')
}) */
app.post('/', (req, res) => {
  res.send('Hello World!POST')
})
app.delete('/', (req, res) => {
  res.send('Hello World!DELETE')
})
app.put('/', (req, res) => {
  res.send('Hello World!PUT')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})