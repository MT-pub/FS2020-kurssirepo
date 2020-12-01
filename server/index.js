const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
const port = 4000

// notice here I'm requiring my database adapter file
// and not requiring node-postgres directly
const db = require('./db')
app.get('/tenttilista/:id', (req, res, next) => {
  db.query(
    'SELECT id,nimi,aloitusaika,lopetusaika FROM tentti where id IN (SELECT tentti_id FROM käyttäjätentti WHERE käyttäjä_id=$1)',
    [req.params.id], (err, dbres) => {
    if (err) {
      return next(err)
    }
    res.send(dbres.rows)
  })
})

app.get('/kysymykset/:id', (req, res, next) => {
  db.query(
    'SELECT id,teksti,tentti_id,aihe_id FROM kysymys where tentti_id=$1',
    [req.params.id], (err, dbres) => {
    if (err) {
      return next(err)
    }
    res.send(dbres.rows)
  })
})

app.get('/vaihtoehdot/:id', (req, res, next) => {
  db.query(
    'SELECT id,teksti,kysymys_id FROM vaihtoehto where kysymys_id=$1',
    [req.params.id], (err, dbres) => {
    if (err) {
      return next(err)
    }
    res.send(dbres.rows)
  })
})

app.post('/tentti', (req, res, next) => {
  db.query(
    "INSERT INTO tentti (nimi) VALUES ('Uusi tentti')",
    (err, dbres) => {
    if (err) {
      return next(err)
    }
    res.send(dbres.rows)
  })
})

app.post('/kysymys', (req, res, next) => {
  db.query(
    "INSERT INTO kysymys (teksti) VALUES ('Uusi kysymys')",
    (err, dbres) => {
    if (err) {
      return next(err)
    }
    res.send(dbres.rows)
  })
})

app.post('/vaihtoehto', (req, res, next) => {
  db.query(
    "INSERT INTO vaihtoehto (nimi) VALUES ('Uusi vastausvaihtoehto')",
    (err, dbres) => {
    if (err) {
      return next(err)
    }
    res.send(dbres.rows)
  })
})

app.delete('/tentti/:id', (req, res, next) => {
  db.query(
    "UPDATE tentti SET poistettu=true WHERE id=$1",
    [req.params.id],
    (err, dbres) => {
    if (err) {
      return next(err)
    }
    res.send(dbres.count)
  })
})

app.delete('/kysymys/:id', (req, res, next) => {
  db.query(
    "UPDATE kysymys SET poistettu=true WHERE id=$1",
    [req.params.id],
    (err, dbres) => {
    if (err) {
      return next(err)
    }
    res.send(dbres.count)
  })
})

app.delete('/vaihtoehto/:id', (req, res, next) => {
  db.query(
    "UPDATE vaihtoehto SET poistettu=true WHERE id=$1",
    [req.params.id],
    (err, dbres) => {
    if (err) {
      return next(err)
    }
    res.send(dbres.count)
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
  res.send('INSERT INTO')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})