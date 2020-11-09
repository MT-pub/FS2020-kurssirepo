import React from 'react'
import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'
import DrawTest from './DrawTest'

function Tests() {
  const initialData = [{
    tentti: "Elektroniikka",
    kysymykset: [{
      kysymys: "Mikä seuraavista on Ohmin laki?",
      vastaukset: [{ vastaus: "U = R * I", valittu: false, oikea: true },
      { vastaus: "U = R / I", valittu: false, oikea: false },
      { vastaus: "U = R^2 * I", valittu: false, oikea: false },
      { vastaus: "U = R / I^2", valittu: false, oikea: false }]
    },
    {
      kysymys: "Mikä on Kirchhoffin virtalaki?",
      vastaukset: [{ vastaus: "Sähkövirtaa tulee pisteeseen yhtä monta reittiä, kuin sitä kyseisestä pisteestä poistuu", valittu: false, oikea: false },
      { vastaus: "Sähkövirta tulee pisteeseen samansuuntaisena, kuin se kyseisestä pisteestä poistuu", valittu: false, oikea: false },
      { vastaus: "Sähkövirta tulee pisteeseen vastakkaiselta suunnalta, kuin se kyseisestä pisteestä poistuu", valittu: false, oikea: false },
      { vastaus: "Sähkövirtaa tulee pisteeseen yhtä paljon, kuin sitä kyseisestä pisteestä poistuu", valittu: false, oikea: true }]
    }]
  },
  {
    tentti: "Matematiikka",
    kysymykset: [{
      kysymys: "Kuinka paljon on 1 + 1?",
      vastaukset: [{ vastaus: "4", valittu: false, oikea: false },
      { vastaus: "3", valittu: false, oikea: false },
      { vastaus: "2", valittu: false, oikea: true },
      { vastaus: "1", valittu: false, oikea: false }]
    },
    {
      kysymys: "Kuinka paljon on 12345 + 54321?",
      vastaukset: [{ vastaus: "1234554321", valittu: false, oikea: false },
      { vastaus: "123454321", valittu: false, oikea: false },
      { vastaus: "66666", valittu: false, oikea: true },
      { vastaus: "55555", valittu: false, oikea: false }]
    }]
  }];

  const [data, setData] = useState([])
  const [test, setTest] = useState("")
  const [answers, setAnswers] = useState(false)
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
    tempData[test].kysymykset[qIndex].vastaukset[aIndex].valittu = event.target.checked
    setData(tempData)
  }

  const showAnswers = () => {
    setAnswers(true)
  }

  const testButtons = () => {
    if (data !== []) {
      return (data.map((item, index) =>
        <Button key={"" + index + data[index].tentti}
          color="primary" onClick={() => { setTest("" + index); setAnswers(false); }}>
          {item.tentti}
        </Button>
      ))
    }
  }



  return (
    <div className="App">
      <div className="menu">
        <button>testimenunappi</button>
      </div>
      <div className="page">
        <div>
          {testButtons()}
        </div>
        {/* <img src='./selma_pieni2.8d5eb9aa.png' className='App-logo'></img> */}
        <div className="test">
          <DrawTest data={data} showAnswers={showAnswers}
            answers={answers} testIndex={test} handleCheckbox={handleCheckbox} />
        </div>
      </div>
    </div >
  );
}

export default Tests;
