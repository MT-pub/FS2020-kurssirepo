import React, { useReducer, useEffect } from 'react'
import './App.css'
import { Button, AppBar, Toolbar } from '@material-ui/core'
import axios from 'axios'
import DoTests from './DoTests'
import EditTests from './EditTests'
import SubjectChart from './Chart'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { FormattedMessage } from 'react-intl';

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

  const [state, dispatch] = useReducer(reducer, { data: [], activeTest: "", fetchData: true, saveData: false, answers: false, showChart: false, });

  const createRemData = async () => {
    try {
      await axios.post("http://localhost:3001/tests", initialData)
      dispatch({ type: "INIT_LIST", data: initialData, fetchData: false })
    }
    catch (exception) {
      alert("Tietokannan alustaminen epäonnistui")
    }
  };

  const fetchRemData = async () => {
    try {
      let result = await axios.get("http://localhost:4000/tenttilista/" + "1")
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
      createRemData()
    }
  };

  const fetchTest = async (testId) => {
    try {
      let result = await axios.get("http://localhost:4000/tentti/" + testId)
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
      await axios.put("http://localhost:4000/tentit", state.data[state.activeTest])
    }
    catch (exception) {
      console.log("Datan päivitys ei onnistunut ", exception)
    }
  };

  useEffect(() => {
    //console.log("Haetaan tenttilistaa")
    fetchRemData()
  }, [])

  useEffect(() => {
    console.log("Tallennetaan")
    saveTest()
  }, [state.saveData])

  useEffect(() => {
    if (state.data.length && !state.data[state.activeTest].questions.length) {
      console.log("Haetaan dataa")
      fetchTest(state.data[state.activeTest].id)
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
          </Switch>
        </div>
      </div >
    </Router>
  );
}

export default App;
