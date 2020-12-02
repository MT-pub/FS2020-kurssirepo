import React, { useReducer, useEffect, useMemo } from 'react'
import './App.css'
import { Button, AppBar, Toolbar } from '@material-ui/core'
import DrawTest from './DrawTest'
import SubjectChart from './Chart'

function DoTests() {

  const testButtons = useMemo(() => {
    if (state.data !== []) {
      return (state.data.map((item, index) =>
        <Button key={"" + index + state.data[index].test}
          color="primary" onClick={() => {
            dispatch({ type: "setTest", test: index });
            dispatch({ type: "setvastaukset", vastaukset: false });
          }}
        >
          {item.test}
        </Button>
      ))
    }
  }, [state.data])

  //console.log(state.data)
  if (!state.showChart) {
    return (
      <div className="App">
        <AppBar position="static" color="primary">
          <Toolbar>
            <Button onClick={() => {
              dispatch({ type: "triggerShowChart" })
            }}>
              Kuvaajanappi
          </Button>
          </Toolbar>
        </AppBar>
        <div className="page">
          <div>
            {testButtons}
          </div>
          {/* <img src='./selma_pieni2.8d5eb9aa.png' className='App-logo'></img> */}
          <div className="test">
            <DrawTest testData={state.data[state.activeTest]} dispatch={dispatch}
              vastaukset={state.vastaukset} testIndex={state.activeTest} />
          </div>
        </div>
      </div >
    );
  } else if (state.showChart) {
    return (
      <div className="App">
        <AppBar position="static" color="primary">
          <Toolbar>
            <Button onClick={() => {
              dispatch({ type: "triggerShowChart" })
            }}>
              Kuvaajanappi
          </Button>
          </Toolbar>
        </AppBar>
        <div className="page">
          <SubjectChart />
        </div>
      </div >
    );
  }
}

export default DoTests;
