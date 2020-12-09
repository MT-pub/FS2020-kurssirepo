const express = require('express')
const cors = require('cors')

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use('/paljokelloon',function (req, res, next) {
  console.log('Kellon on:', Date.now())
  next()
})

const port = 4000

// notice here I'm requiring my database adapter file
// and not requiring node-postgres directly
const db = require('./db')
app.get('/tenttilista/:id', (req, res, next) => {
  db.query(
    'SELECT id,nimi AS name,aloitusaika AS starttime,lopetusaika AS stoptime FROM tentti where id IN (SELECT tentti_id FROM käyttäjätentti WHERE käyttäjä_id=$1)',
    [req.params.id], (err, dbres) => {
    if (err) {
      return next(err)
    }
    let tentit=dbres.rows

    if(Array.isArray(tentit)){
      let len = tentit.length
      for(let i=0;i<len;i++){
        tentit[i].questions = []
      }
    } else if(tentit) {
      tentit.questions = []
    }

    res.send(tentit)
  })
})

app.get('/tentti/:id', (req, res, next) => {
  let questions = []
  db.query(
    'SELECT id,teksti AS text,tentti_id AS test_id,aihe_id AS subject_id FROM kysymys where tentti_id=$1',
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
    
    if(Array.isArray(questions)){
      let k_length = questions.length
      let v_length = dbres.rows.length
      
      for(let k=0;k<k_length;k++){
        questions[k].answers = []
        for(let v=0;v<v_length;v++){
          if(questions[k].id === dbres.rows[v].question_id){
            questions[k].answers.push(dbres.rows[v])
            questions[k].answers[questions[k].answers.length - 1].checked = false
          }
        }
      }
    } else if (questions) {
      questions = [questions]
      questions[0].answers = []
      let v_length = dbres.rows.length
      
      for(let v=0;v<v_length;v++){
        questions[0].answers.push(dbres.rows[v])
      }
    }

    res.send(questions)
  })
})

app.get('/kysymykset/:id', (req, res, next) => {
  db.query(
    'SELECT id,teksti AS text,tentti_id AS test_id,aihe_id AS subject_id FROM kysymys where tentti_id=$1',
    [req.params.id], (err, dbres) => {
    if (err) {
      return next(err)
    }
    res.send(dbres.rows)
  })
})

app.get('/vaihtoehdot/:id', (req, res, next) => {
  db.query(
    'SELECT id,teksti AS text,kysymys_id AS question_id FROM vaihtoehto where kysymys_id=$1',
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
    "INSERT INTO kysymys (teksti,tentti_id) VALUES ('Uusi kysymys',$1)",
    [req.body.tentti_id],
    (err, dbres) => {
    if (err) {
      return next(err)
    }
    res.send(dbres.rows)
  })
})

app.post('/vaihtoehto', (req, res, next) => {
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

app.put('/tentti/:id', (req, res, next) => {
  db.query(
    "UPDATE tentti SET nimi=$2 WHERE id=$1",
    [req.params.id,req.body.nimi],
    (err, dbres) => {
    if (err) {
      return next(err)
    }
    res.send(dbres.rows)
  })
})

app.put('/kysymys/:id', (req, res, next) => {
  db.query(
    "UPDATE kysymys SET teksti=$2 WHERE id=$1",
    [req.params.id,req.body.teksti],
    (err, dbres) => {
    if (err) {
      return next(err)
    }
    res.send(dbres.rows)
  })
})

app.put('/vaihtoehto/:id', (req, res, next) => {
  db.query(
    "UPDATE vaihtoehto SET teksti=$2 WHERE id=$1",
    [req.params.id,req.body.teksti],
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
    res.send(dbres.rowCount)
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