import React, { useEffect, useReducer } from 'react'
import './App.css'
import { Button, Icon, IconButton, AppBar, Toolbar } from '@material-ui/core'
import EditTest from './EditTest'
import axios from 'axios'

const initialData = [{
  id: 0,
  test: "Elektroniikka",
  questions: [{
    question: "Mikä seuraavista on Ohmin laki?",
    answers: [{ answer: "U = R * I", checked: false, correct: true },
    { answer: "U = R / I", checked: false, correct: false },
    { answer: "U = R^2 * I", checked: false, correct: false },
    { answer: "U = R / I^2", checked: false, correct: false }]
  },
  {
    question: "Mikä on Kirchhoffin virtalaki?",
    answers: [{ answer: "Sähkövirtaa tulee pisteeseen yhtä monta reittiä, kuin sitä kyseisestä pisteestä poistuu", checked: false, correct: false },
    { answer: "Sähkövirta tulee pisteeseen samansuuntaisena, kuin se kyseisestä pisteestä poistuu", checked: false, correct: false },
    { answer: "Sähkövirta tulee pisteeseen vastakkaiselta suunnalta, kuin se kyseisestä pisteestä poistuu", checked: false, correct: false },
    { answer: "Sähkövirtaa tulee pisteeseen yhtä paljon, kuin sitä kyseisestä pisteestä poistuu", checked: false, correct: true }]
  }]
},
{
  id: 1,
  test: "Matematiikka",
  questions: [{
    question: "Kuinka paljon on 1 + 1?",
    answers: [{ answer: "4", checked: false, correct: false },
    { answer: "3", checked: false, correct: false },
    { answer: "2", checked: false, correct: true },
    { answer: "1", checked: false, correct: false }]
  },
  {
    question: "Kuinka paljon on 12345 + 54321?",
    answers: [{ answer: "1234554321", checked: false, correct: false },
    { answer: "123454321", checked: false, correct: false },
    { answer: "66666", checked: false, correct: true },
    { answer: "55555", checked: false, correct: false }]
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
    /* case 'setFetchData':
      deepCopy.fetchData = action.fetchData
      return deepCopy */
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

function Tests() {

  const [state, dispatch] = useReducer(reducer, { data: [], activeTest: "", fetchData: true });

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
      let result = await axios.get("http://localhost:3001/tests")
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


  const testButtons = () => {
    if (state.data !== []) {
      return (
        <>
          {state.data.map((item, index) =>
            <Button key={"" + index + state.data[index].test}
              color="primary" onClick={() => { dispatch({ type: "setTest", test: index }) }}>
              {item.test}
            </Button>)}
          <IconButton size="medium"
            className="answer"
            onClick={() => dispatch({ type: "addTest" })}>
            <Icon>add-circle</Icon>
            <span>&nbsp;Lisää tentti</span>
          </IconButton>
        </>
      )
    }
  };

  return (
    <div className="App">
      <AppBar position="static" color="primary">
        <Toolbar>
          <Button>
            Testinappi
          </Button>
        </Toolbar>
      </AppBar>
      <div className="page">
        <div>
          {testButtons()}
        </div>
        {/* <img src='./selma_pieni2.8d5eb9aa.png' className='App-logo'></img> */}
        <div className="test">
          <EditTest testData={state.data[state.activeTest]}
            testIndex={state.activeTest}
            dispatch={dispatch} />
        </div>
      </div>
    </div >
  );
}

export default Tests;
