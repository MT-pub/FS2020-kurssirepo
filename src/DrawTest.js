import { Button } from '@material-ui/core'
import React from 'react'
import {MemoizedDrawQuestion} from './DrawQuestion'

function DrawTest({ testData, testIndex, answers, dispatch }) {

  if (testIndex !== "") {
    //console.log(props.test.test)
    return (
      <>
        {testData.questions.map((item, index) => {
          return (<MemoizedDrawQuestion q={item} qIndex={index} testData={testData} testIndex={testIndex} answers={answers} dispatch={dispatch} />);
        })}
        {answers ? null : <div>
          <Button key={testData.test + " showAnswers"}
            variant="contained"
            color="primary" onClick={() => { dispatch({type:"setAnswers", answers:true}) }}>
            Näytä vastaukset
          </Button>
        </div>}
      </>
    )
  } else {
    return null
  }
}

export default DrawTest;