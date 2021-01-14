import { Button } from '@material-ui/core'
import React from 'react'
import {MemoizedDrawQuestion} from './DrawQuestion'
import { FormattedMessage } from 'react-intl';

function DrawTest({ testData, testIndex, answers, dispatch }) {

console.log(testData)

  if (testIndex !== "" && testData.questions) {
    //console.log(props.test.test)
    return (
      <>
        {testData.questions.map((item, index) => {
          return (<MemoizedDrawQuestion key={"question" + testData.id + item.id} q={item} qIndex={index} testData={testData} testIndex={testIndex} answers={answers} dispatch={dispatch} />);
        })}
        {answers ? null : <div>
          <Button key={testData.name + " showAnswers"}
            variant="contained"
            color="primary" onClick={() => { dispatch({type:"setAnswers", answers:true}) }}>
            <FormattedMessage id="app.show-answers-button" defaultMessage="Show answers" description="Tests-button on AppBar"/>
          </Button>
        </div>}
      </>
    )
  } else {
    return null
  }
}

export default DrawTest;