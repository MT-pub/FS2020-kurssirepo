const express = require('express')
const passport = require('passport')
const db = require('../db')

const router = express.Router()

router.get('/tenttilista/:id', (req, res, next) => {
  db.query(
    'SELECT id,nimi AS name,aloitusaika AS starttime,lopetusaika AS stoptime FROM tentti WHERE id IN (SELECT tenttiid FROM käyttäjätentti WHERE käyttäjäid=$1)',
    [req.params.id], (err, dbres) => {
      if (err) {
        return next(err)
      }
      let tentit = dbres.rows

      if (Array.isArray(tentit)) {
        let len = tentit.length
        for (let i = 0; i < len; i++) {
          tentit[i].questions = []
        }
      } else if (tentit) {
        tentit.questions = []
      }

      res.send(tentit)
    })
})

router.get('/tentti/:id', (req, res, next) => {
  let questions = []
  db.query(
    'SELECT id,teksti AS text,tentti_id AS test_id,aihe_id AS subject_id FROM kysymys WHERE tentti_id=$1',
    [req.params.id], (err, dbres) => {
      if (err) {
        return next(err)
      }

      questions = dbres.rows
    })

  db.query(
    'SELECT id,teksti AS text,kysymys_id AS question_id FROM vaihtoehto where poistettu=false AND kysymys_id IN (SELECT id FROM kysymys where tentti_id=$1)',
    [req.params.id], (err, dbres) => {
      if (err) {
        return next(err)
      }

      if (Array.isArray(questions)) {
        let k_length = questions.length
        let v_length = dbres.rows.length

        for (let k = 0; k < k_length; k++) {
          questions[k].answers = []
          for (let v = 0; v < v_length; v++) {
            if (questions[k].id === dbres.rows[v].question_id) {
              questions[k].answers.push(dbres.rows[v])
              questions[k].answers[questions[k].answers.length - 1].checked = false
            }
          }
        }
      } else if (questions) {
        questions = [questions]
        questions[0].answers = []
        let v_length = dbres.rows.length

        for (let v = 0; v < v_length; v++) {
          questions[0].answers.push(dbres.rows[v])
        }
      }

      res.send(questions)
    })
})

router.get('/kysymykset/:id', (req, res, next) => {
  db.query(
    'SELECT id,teksti AS text,tentti_id AS test_id,aihe_id AS subject_id FROM kysymys where tentti_id=$1',
    [req.params.id], (err, dbres) => {
      if (err) {
        return next(err)
      }
      res.send(dbres.rows)
    })
})

router.get('/vaihtoehdot/:id', (req, res, next) => {
  db.query(
    'SELECT id,teksti AS text,kysymys_id AS question_id FROM vaihtoehto where kysymys_id=$1',
    [req.params.id], (err, dbres) => {
      if (err) {
        return next(err)
      }
      res.send(dbres.rows)
    })
})

router.post('/tentti', (req, res, next) => {
  db.query(
    "INSERT INTO tentti (nimi) VALUES ('Uusi tentti')",
    (err, dbres) => {
      if (err) {
        return next(err)
      }
      res.send(dbres.rows)
    }
  )
})

router.post('/kysymys', (req, res, next) => {
  db.query(
    "INSERT INTO kysymys (teksti,tentti_id) VALUES ('Uusi kysymys',$1)",
    [req.body.tentti_id],
    (err, dbres) => {
      if (err) {
        return next(err)
      }
      res.send(dbres.rows)
    })
})

router.post('/vaihtoehto', (req, res, next) => {
  db.query(
    "INSERT INTO vaihtoehto (nimi,kysymys_id) VALUES ('Uusi vastausvaihtoehto',$1)",
    [req.body.kysymys_id],
    (err, dbres) => {
      if (err) {
        return next(err)
      }
      res.send(dbres.rows)
    })
})

router.put('/tentti/:id', (req, res, next) => {
  db.query(
    "UPDATE tentti SET nimi=$2 WHERE id=$1",
    [req.params.id, req.body.nimi],
    (err, dbres) => {
      if (err) {
        return next(err)
      }
      res.send(dbres.rows)
    })
})

router.put('/kysymys/:id', (req, res, next) => {
  db.query(
    "UPDATE kysymys SET teksti=$2 WHERE id=$1",
    [req.params.id, req.body.teksti],
    (err, dbres) => {
      if (err) {
        return next(err)
      }
      res.send(dbres.rows)
    })
})

router.put('/vaihtoehto/:id', (req, res, next) => {
  db.query(
    "UPDATE vaihtoehto SET teksti=$2 WHERE id=$1",
    [req.params.id, req.body.teksti],
    (err, dbres) => {
      if (err) {
        return next(err)
      }
      res.send(dbres.rows)
    })
})

router.delete('/tentti/:id', (req, res, next) => {
  db.query(
    "UPDATE tentti SET poistettu=true WHERE id=$1",
    [req.params.id],
    (err, dbres) => {
      if (err) {
        return next(err)
      }
      res.send(dbres.rowCount)
    })
})

router.delete('/kysymys/:id', (req, res, next) => {
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

router.delete('/vaihtoehto/:id', (req, res, next) => {
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

/* router.get('/', (req, res) => {
  res.send('Hello World!GET')
}) */
router.post('/', (req, res) => {
  res.send('Hello World!POST')
})
router.delete('/', (req, res) => {
  res.send('Hello World!DELETE')
})
router.put('/', (req, res) => {
  res.send('INSERT INTO')
})


module.exports = router