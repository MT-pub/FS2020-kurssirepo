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

const initialData = [{
  id: 1,
  nimi: "Elektroniikka",
  kysymykset: [{
    kysymys: "Mikä seuraavista on Ohmin laki?",
    vastaukset: [{ teksti: "U = R * I", checked: false, correct: true },
    { teksti: "U = R / I", checked: false, correct: false },
    { teksti: "U = R^2 * I", checked: false, correct: false },
    { teksti: "U = R / I^2", checked: false, correct: false }]
  },
  {
    kysymys: "Mikä on Kirchhoffin virtalaki?",
    vastaukset: [{ teksti: "Sähkövirtaa tulee pisteeseen yhtä monta reittiä, kuin sitä kyseisestä pisteestä poistuu", checked: false, correct: false },
    { teksti: "Sähkövirta tulee pisteeseen samansuuntaisena, kuin se kyseisestä pisteestä poistuu", checked: false, correct: false },
    { teksti: "Sähkövirta tulee pisteeseen vastakkaiselta suunnalta, kuin se kyseisestä pisteestä poistuu", checked: false, correct: false },
    { teksti: "Sähkövirtaa tulee pisteeseen yhtä paljon, kuin sitä kyseisestä pisteestä poistuu", checked: false, correct: true }]
  }]
},
{
  id: 2,
  nimi: "Matematiikka",
  kysymykset: [{
    teksti: "Kuinka paljon on 1 + 1?",
    vastaukset: [{ teksti: "4", checked: false, correct: false },
    { teksti: "3", checked: false, correct: false },
    { teksti: "2", checked: false, correct: true },
    { teksti: "1", checked: false, correct: false }]
  },
  {
    teksti: "Kuinka paljon on 12345 + 54321?",
    vastaukset: [{ teksti: "1234554321", checked: false, correct: false },
    { teksti: "123454321", checked: false, correct: false },
    { teksti: "66666", checked: false, correct: true },
    { teksti: "55555", checked: false, correct: false }]
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
        .questions[action.qIndex].question = action.event.target.value
      return deepCopy
    case 'handleAnswer':
      deepCopy.data[deepCopy.activeTest]
        .questions[action.qIndex]
        .answers[action.aIndex].answer = action.event.target.value
    case 'addTest':
      let emptyTest = {
        test: "test",
        questions: []
      }
      deepCopy.data.push(emptyTest)
      return deepCopy
    case 'addQuestion':
      let emptyQuestion = {
        question: "question",
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
    case 'setTest':
      deepCopy.activeTest = action.test
      //console.log(deepCopy.test)
      return deepCopy
    case 'INIT_DATA':
      deepCopy.fetchData = action.fetchData
      deepCopy.data = action.data
      return deepCopy
    default:
      throw new Error('No action specified')
  }
}

function App() {

  const [state, dispatch] = useReducer(reducer, { data: [], activeTest: "", fetchData: true, vastaukset: false, showChart: false });

  const createRemData = async () => {
    try {
      await axios.post("http://localhost:3001/tests", initialData)
      dispatch({ type: "INIT_DATA", data: initialData, fetchData: false })
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
        dispatch({ type: "INIT_DATA", data: result.data, fetchData: false })
      } else {
        throw new Error("Ei dataa.. luodaan..")

      }
    }
    catch (exception) {
      console.log(exception)
      createRemData()
    }
  };

  const saveRemData = async () => {
    try {
      await axios.put("http://localhost:3001/tests", state.data)
    }
    catch (exception) {
      console.log("Datan päivitys ei onnistunut ", exception)
    }
  };

  useEffect(() => {
    fetchRemData()
  }, [])

  useEffect(() => {
    if (!state.fetchData) {
      saveRemData()
    }
  }, [state.data])

  //console.log(state.data)

  return (
    <Router>
      <div className="App">
        <AppBar position="static" color="primary">
          <Toolbar>
            <Button component={Link} to="/">
              Tentit
            </Button>
            <Button component={Link} to="/kuvaajat">
              Kuvaajat
            </Button>
            <Button component={Link} to="/hallinta">
              Hallinta
            </Button>
          </Toolbar>
        </AppBar>
        <Switch>
          <div className="page">
            <Route path="/kuvaajat">
              <SubjectChart />
            </Route>
            <Route path="/hallinta">
              <EditTests state={state} dispatch={dispatch} />
            </Route>
            <Route exact path="/">
              <DoTests state={state} dispatch={dispatch} />
            </Route>
          </div>
        </Switch>
      </div >
    </Router>
  );
}

export default App;
