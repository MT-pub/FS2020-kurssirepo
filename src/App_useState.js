/* import React from 'react'
import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'
import DrawTest from './DrawTest'
import Axios from 'axios'

function App() {
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
  const [answers, setAnswers] = useState(false)
  const [fetchData, setFetchData] = useState(true)

  useEffect(() => {
    const remData = async () => {
      let result = await Axios.get("http://localhost:3001/tests/")
      setData(result.data)
      setFetchData(false)
    }

    remData()
  }, [])

  useEffect(() => {
    if (!fetchData) {
      window.localStorage.setItem("data", JSON.stringify(data))
    }
  }, [data])

  const handleCheckbox = (event, qIndex, aIndex) => {
    var tempData = JSON.parse(JSON.stringify(data))
    tempData[test].questions[qIndex].answers[aIndex].checked = event.target.checked
    setData(tempData)
  }

  const showAnswers = () => {
    setAnswers(true)
  }

  const testButtons = () => {
    if (data !== []) {
      return (data.map((item, index) =>
        <Button key={"" + index + data[index].test}
          color="primary" onClick={() => { setTest("" + index); setAnswers(false); }}>
          {item.test}
        </Button>
      ))
    }
  }


console.log(data)
  if(data){return (
    <div className="App">
      <div className="menu">
        <button>testimenunappi</button>
      </div>
      <div className="page">
        <div>
          {testButtons()}
        </div>
        {// <img src='./selma_pieni2.8d5eb9aa.png' className='App-logo'></img> }
        <div className="test">
          <DrawTest testData={data[test]} showAnswers={showAnswers}
            answers={answers} testIndex={test} handleCheckbox={handleCheckbox} />
        </div>
      </div>
    </div >
  );} else {return null}
}

export default App;
 */