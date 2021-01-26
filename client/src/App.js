import React, { useReducer, useEffect } from 'react'
import './App.css'
import { Button, AppBar, Toolbar } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import axios from 'axios'
import DoTests from './DoTests'
import EditTests from './EditTests'
import SubjectChart from './Chart'
import LoginPage from './LoginPage'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { FormattedMessage, useIntl } from 'react-intl';
import Dropzone from 'react-dropzone'
import socketIOClient from 'socket.io-client'
import { borderRight } from '@material-ui/system'


var sIOEndpoint = null
var path = null





switch (process.env.NODE_ENV) {
  case 'production':
    console.log("production NODE_ENV")
    path = 'https://fs2020-tentti.herokuapp.com/'
    sIOEndpoint = "http://fs2020-tentti.herokuapp.com/"
    break
  case 'development':
    console.log("development NODE_ENV")
    path = 'http://localhost:4000/'
    sIOEndpoint = 'http://localhost:4000'
    break
  case 'test':
    path = 'http://localhost:4000/'
    sIOEndpoint = 'http://localhost:4000'
    break
  default:
    throw "Environment not properly set!"
}

const initialData = [{
  id: 1,
  name: "Elektroniikka",
  questions: [{
    text: "Mikä seuraavista on Ohmin laki?",
    answers: [{ text: "U = R * I", checked: false, correct: true },
    { text: "U = R / I", checked: false, correct: false },
    { text: "U = R^2 * I", checked: false, correct: false },
    { text: "U = R / I^2", checked: false, correct: false }]
  },
  {
    text: "Mikä on Kirchhoffin virtalaki?",
    answers: [{ text: "Sähkövirtaa tulee pisteeseen yhtä monta reittiä, kuin sitä kyseisestä pisteestä poistuu", checked: false, correct: false },
    { text: "Sähkövirta tulee pisteeseen samansuuntaisena, kuin se kyseisestä pisteestä poistuu", checked: false, correct: false },
    { text: "Sähkövirta tulee pisteeseen vastakkaiselta suunnalta, kuin se kyseisestä pisteestä poistuu", checked: false, correct: false },
    { text: "Sähkövirtaa tulee pisteeseen yhtä paljon, kuin sitä kyseisestä pisteestä poistuu", checked: false, correct: true }]
  }]
},
{
  id: 2,
  name: "Matematiikka",
  questions: [{
    text: "Kuinka paljon on 1 + 1?",
    answers: [{ text: "4", checked: false, correct: false },
    { text: "3", checked: false, correct: false },
    { text: "2", checked: false, correct: true },
    { text: "1", checked: false, correct: false }]
  },
  {
    text: "Kuinka paljon on 12345 + 54321?",
    answers: [{ text: "1234554321", checked: false, correct: false },
    { text: "123454321", checked: false, correct: false },
    { text: "66666", checked: false, correct: true },
    { text: "55555", checked: false, correct: false }]
  }]
}];

function reducer(state, action) {
  let deepCopy = JSON.parse(JSON.stringify(state));

  //console.log(deepCopy)
  switch (action.type) {
    case 'handleCheckbox':
      deepCopy.data[deepCopy.activeTest]
        .questions[action.qIndex]
        .answers[action.aIndex].correct = action.event.target.checked
      return deepCopy
    case 'handleTest':
      deepCopy.data[deepCopy.activeTest].test = action.event.target.value
      return deepCopy
    case 'handleQuestion':
      deepCopy.data[deepCopy.activeTest]
        .questions[action.qIndex].text = action.event.target.value
      return deepCopy
    case 'handleAnswer':
      deepCopy.data[deepCopy.activeTest]
        .questions[action.qIndex]
        .answers[action.aIndex].answer = action.event.target.value
      return deepCopy
    case 'addTest':
      let emptyTest = {
        test: "test",
        questions: []
      }
      deepCopy.data.push(emptyTest)
      return deepCopy
    case 'addQuestion':
      let emptyQuestion = {
        text: "text",
        answers: []
      }
      deepCopy.data[deepCopy.activeTest]
        .questions.push(emptyQuestion)
      return deepCopy
    case 'addAnswer':
      let emptyAnswer = {
        answer: "answer",
        checked: false,
        correct: false
      }
      deepCopy.data[deepCopy.activeTest]
        .questions[action.qIndex]
        .answers.push(emptyAnswer)
      return deepCopy
    case 'changeAnswer':
      deepCopy.data[state.activeTest]
        .questions[action.qIndex]
        .answers[action.aIndex].checked = action.event.target.checked
      return deepCopy
    case 'removeTest':
      deepCopy.data.splice(deepCopy.activeTest, 1)
      deepCopy.activeTest = ""
      return deepCopy
    case 'removeQuestion':
      deepCopy.data[deepCopy.activeTest]
        .questions.splice(action.qIndex, 1)
      return deepCopy
    case 'removeAnswer':
      deepCopy.data[deepCopy.activeTest]
        .questions[action.qIndex]
        .answers.splice(action.aIndex, 1)
      return deepCopy
    case 'setFetchData':
      deepCopy.fetchData = action.fetchData
      return deepCopy
    case 'setSaveData':
      deepCopy.fetchData = action.fetchData
      return deepCopy
    case 'setTest':
      deepCopy.activeTest = action.test
      /* if(deepCopy.data[deepCopy.activeTest].questions === []){
        fetchTest(state.data[state.activeTest].id)
      } */
      //console.log(deepCopy.test)
      return deepCopy
    case 'setToken':
      deepCopy.token = action.payload
      return deepCopy
    case 'setAnswers':
      deepCopy.answers = action.payload
      return deepCopy
    case 'fileAccepted':
      deepCopy.file = 1
      return deepCopy
    case 'INIT_LIST':
      deepCopy.fetchData = action.fetchData
      deepCopy.data = action.data
      return deepCopy
    case 'INIT_TEST':
      deepCopy.data[deepCopy.activeTest].questions = action.data
      return deepCopy
    default:
      throw new Error('No action specified')
  }
}

function App() {

  const [state, dispatch] = useReducer(reducer, { file: 0, token: 0, data: [], activeTest: "", fetchData: true, saveData: false, answers: false, showChart: false, });
  const intl = useIntl()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const createRemData = async () => {
    try {
      await axios.post(path + "tests", initialData, { headers: { Authorization: 'Bearer ' + state.token } })
      dispatch({ type: "INIT_LIST", data: initialData, fetchData: false })
    }
    catch (exception) {
      alert(intl.formatMessage({ id: 'error.db-no-fetch' }))//"Tietokannan alustaminen epäonnistui")
    }
  };

  const fetchRemData = async () => {
    try {
      let result = await axios.get(path + "tenttilista/" + "1", { headers: { 'Authorization': 'Bearer ' + state.token } })
      //console.log(result)
      if (result.data.length > 0) {
        //console.log("fetchIf")
        dispatch({ type: "INIT_LIST", data: result.data, fetchData: false })
      } else {
        throw new Error("Ei dataa.. luodaan..")

      }
    }
    catch (exception) {
      console.log(exception)
      //createRemData()
    }
  };

  const fetchTest = async (testId) => {
    try {
      console.log("GET " + path + "tentti/" + testId)
      let result = await axios.get(path + "tentti/" + testId, { headers: { 'Authorization': 'Bearer ' + state.token } })
      //console.log(result)
      if (result.data.length > 0) {
        //console.log("fetchIf")
        dispatch({ type: "INIT_TEST", data: result.data })
      } else {
        throw new Error("Tentin hakemisessa tapahtui virhe")
      }
    }
    catch (exception) {
      console.log(exception)
    }
  };

  const saveTest = async () => {
    try {
      await axios.put(path + "tentit", state.data[state.activeTest], { headers: { 'Authorization': 'Bearer ' + state.token } })
    }
    catch (exception) {
      console.log("Datan päivitys ei onnistunut ", exception)
    }
  };

  const login = async (e, user, pw) => {

    //tämä estää napinpainallusta päivittämästä sivua
    e.preventDefault()

    try {
      let response = await axios.post(path + "login", { email: user, password: pw })

      console.log(response.data)

      dispatch({ type: "setToken", payload: response.data })

      return
      //dispatch({type: "setToken"})
    }
    catch (exception) {
      console.log("Kirjautuminen ei onnistunut ", exception)
    }
  }

  const uploadFile = async (file) => {
    let formData = new FormData()

    formData.append("file", file[0])

    console.log("post kuva")
    try {
      let result = await axios.post(path + "upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + state.token
        }
      })
      //console.log(result)
      if (result.data == 'Tiedosto vastaanotettu') {
        console.log("fileAccepted")
        dispatch({ type: "fileAccepted" })
      } else {
        throw new Error("Tiedostoa ei voitu ladata")

      }
    }
    catch (exception) {
      console.log(exception)
      //createRemData()
    }
  }

  //endpoint: 'ws://localhost:9000'
  useEffect(() => {
    if (state.token !== 0) {
      const socket = socketIOClient(sIOEndpoint, {
        extraHeaders: {
          Authorization: "Bearer " + state.token
        }
      })
      socket.on('connected', function (data) {
        //console.log("Socket.io: Connected")
        enqueueSnackbar("Socket.io: Connected")
        socket.emit('ready for data', {});
      });
      socket.on('update', function (data) {
        let notification = JSON.parse(data.message.payload)

        console.log(notification)

        if (notification.type === "insert test")
          enqueueSnackbar("Uusi tentti luotu tietokantaan")
        else if (notification.type === "update test")
          enqueueSnackbar("Tenttiä ")
        //console.log(data.message.payload);

        // CLEAN UP THE EFFECT
        return () => socket.disconnect()
      })
    }
  }, [state.token])

  useEffect(() => {
    //console.log("Haetaan tenttilistaa")
    if (state.token !== 0) {
      fetchRemData()
    }
  }, [state.token])

  useEffect(() => {
    console.log("Tallennetaan")
    saveTest()
  }, [state.saveData])

  useEffect(() => {
    if (state.data.length && !state.data[state.activeTest].questions.length) {
      console.log("Haetaan dataa")
      fetchTest(state.data[state.activeTest].tenttiid)
    }
  }, [state.activeTest])

  //console.log(state.data)

  return (

    <Router>
      <div className="App">
        <AppBar position="static" color="primary">
          <Toolbar>
            <Button component={Link} to="/">
              <FormattedMessage id="app.tests-button" defaultMessage="Tests" description="Tests-button on AppBar" />
            </Button>
            <Button component={Link} to="/kuvaajat">
              <FormattedMessage id="app.graphs-button" defaultMessage="Graphs" description="Tests-button on AppBar" />
            </Button>
            <Button component={Link} to="/hallinta">
              <FormattedMessage id="app.control-button" defaultMessage="Control" description="Tests-button on AppBar" />
            </Button>
            {state.token === 0 ?
              <Button component={Link} to="/login">
                <FormattedMessage id="app.login-button" defaultMessage="Login" description="Tests-button on AppBar" />
              </Button> :
              <Button component={Link} to="/login">
                <FormattedMessage id="app.logout-button" defaultMessage="Logout" description="Tests-button on AppBar" />
              </Button>}
            <div>
              <Dropzone accept='image/jpeg' multiple={false} onDrop={files => {
                console.log(files)
                uploadFile(files)
              }}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>Vedä tiedosto tähän tai klikkaa valitaksesi tiedoston</p>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
          </Toolbar>
        </AppBar>
        <div className="page">
          <Switch>
            <Route path="/kuvaajat">
              <SubjectChart />
            </Route>
            <Route path="/hallinta">
              <EditTests state={state} dispatch={dispatch} />
            </Route>
            <Route exact path="/">
              <DoTests state={state} dispatch={dispatch} />
            </Route>
            <Route path="/login">
              <LoginPage state={state} login={login} />
            </Route>
          </Switch>
        </div>
      </div >
    </Router>
  );
}

export default App;
