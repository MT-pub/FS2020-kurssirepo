import React, { useMemo } from 'react'
import './App.css'
import { Button } from '@material-ui/core'
import DrawTest from './DrawTest'

function DoTests({ state, dispatch }) {

  const testButtons = useMemo(() => {
    if (state.data !== []) {
      return (state.data.map((item, index) =>
        <Button key={"" + state.data[index].id + state.data[index].name}
          color="primary" onClick={() => {
            dispatch({ type: "setTest", test: index });
            dispatch({ type: "setAnswers", payload: false });
          }}
        >
          {item.name}
        </Button>
      ))
    }
  }, [state.data, dispatch])

  //console.log(state.data)
  if (state.data.length && state.activeTest !== '' && state.data[state.activeTest].kysymykset !== []) {
    return (
      <div className="page">
        <div>
          {testButtons}
        </div>
        {/* <img src='./selma_pieni2.8d5eb9aa.png' className='App-logo'></img> */}
        <div className="test">
          <DrawTest testData={state.data[state.activeTest]} dispatch={dispatch}
            answers={state.answers} testIndex={state.activeTest} />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div>
        {testButtons}
      </div>
    </div>)
}

export default DoTests;
