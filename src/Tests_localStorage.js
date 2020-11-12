import React from 'react'
import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'
import { Button, Icon, IconButton, AppBar, Toolbar } from '@material-ui/core'
import EditTest from './EditTest';

function Tests() {
  const initialData = [{
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

  const [data, setData] = useState([])
  const [test, setTest] = useState("")
  const [fetchData, setFetchData] = useState(true)

  useEffect(() => {
    let tempStorage = window.localStorage;
    let tempData = JSON.parse(tempStorage.getItem("data"))
    if (!tempData || tempData === []) {
      tempStorage.setItem("data", JSON.stringify(initialData))
      tempData = initialData
    }
    setData(tempData)
    setFetchData(false)
  }, [])

  useEffect(() => {
    if (!fetchData) {
      window.localStorage.setItem("data", JSON.stringify(data))
    }
  }, [data])

  const handleCheckbox = (event, qIndex, aIndex) => {
    var tempData = JSON.parse(JSON.stringify(data))
    tempData[test].questions[qIndex].answers[aIndex].correct = event.target.checked
    setData(tempData)
  }

  const handleTest = (event) => {
    var tempData = JSON.parse(JSON.stringify(data))
    tempData[test].test = event.target.value
    setData(tempData)
  }

  const handleQuestion = (event, qIndex) => {
    var tempData = JSON.parse(JSON.stringify(data))
    tempData[test].questions[qIndex].question = event.target.value
    setData(tempData)
  }

  const handleAnswer = (event, qIndex, aIndex) => {
    var tempData = JSON.parse(JSON.stringify(data))
    tempData[test].questions[qIndex].answers[aIndex].answer = event.target.value
    setData(tempData)
  }

  const addTest = () => {
    var tempData = JSON.parse(JSON.stringify(data))
    var emptyTest = {
      test: "test",
      questions: []
    }
    tempData.push(emptyTest)
    setData(tempData)
  }

  const addQuestion = () => {
    var tempData = JSON.parse(JSON.stringify(data))
    var emptyQuestion = {
      question: "question",
      answers: []
    }
    tempData[test].questions.push(emptyQuestion)
    setData(tempData)
  }

  const addAnswer = (qIndex) => {
    var tempData = JSON.parse(JSON.stringify(data))
    var emptyAnswer = {
      answer: "answer",
      checked: false,
      correct: false
    }
    tempData[test].questions[qIndex].answers.push(emptyAnswer)
    setData(tempData)
  }

  const removeTest = () => {
    var tempData = JSON.parse(JSON.stringify(data))
    tempData.splice(test, 1)
    setData(tempData)
    setTest("")
  }

  const removeQuestion = (qIndex) => {
    var tempData = JSON.parse(JSON.stringify(data))
    tempData[test].questions.splice(qIndex, 1)
    setData(tempData)
  }

  const removeAnswer = (qIndex, aIndex) => {
    var tempData = JSON.parse(JSON.stringify(data))
    tempData[test].questions[qIndex].answers.splice(aIndex, 1)
    setData(tempData)
  }


  const testButtons = () => {
    if (data !== []) {
      return (
        <>
          {data.map((item, index) =>
            <Button key={"" + index + data[index].test}
              color="primary" onClick={() => { setTest("" + index) }}>
              {item.test}
            </Button>)}
          <IconButton size="medium"
            className="answer"
            onClick={() => addTest()}>
            <Icon>add-circle</Icon>
            <span>&nbsp;Lisää tentti</span>
          </IconButton>
        </>
      )
    }
  }



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
          <EditTest testData={data[test]}
            testIndex={test}
            handleCheckbox={handleCheckbox} handleAnswer={handleAnswer}
            handleQuestion={handleQuestion} handleTest={handleTest}
            addQuestion={addQuestion} removeQuestion={removeQuestion}
            addAnswer={addAnswer} removeAnswer={removeAnswer}
            removeTest={removeTest} />
        </div>
      </div>
    </div >
  );
}

export default Tests;
