import React from 'react'
import './App.css'
import { Button, Icon, IconButton } from '@material-ui/core'
import EditTest from './EditTest'


function EditTests({ state, dispatch }) {

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
    <>
      <div>
        {testButtons()}
      </div>
      {/* <img src='./selma_pieni2.8d5eb9aa.png' className='App-logo'></img> */}
      <div className="test">
        <EditTest testData={state.data[state.activeTest]}
          testIndex={state.activeTest}
          dispatch={dispatch} />
      </div>
    </>
  );
}

export default EditTests;
