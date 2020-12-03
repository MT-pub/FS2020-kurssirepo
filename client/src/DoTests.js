import React, { useMemo } from 'react'
import './App.css'
import { Button } from '@material-ui/core'
import DrawTest from './DrawTest'

function DoTests({state,dispatch}) {

  const testButtons = useMemo(() => {
    if (state.data !== []) {
      return (state.data.map((item, index) =>
        <Button key={"" + index + state.data[index].nimi}
          color="primary" onClick={() => {
            dispatch({ type: "setTest", test: index });
            //dispatch({ type: "setvastaukset", vastaukset: false });
          }}
        >
          {item.nimi}
        </Button>
      ))
    }
  }, [state.data, dispatch])

  //console.log(state.data)
    return (
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
    );
}

export default DoTests;
