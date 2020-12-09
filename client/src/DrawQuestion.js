import { Paper, Checkbox, FormControlLabel } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { withStyles } from '@material-ui/core/styles';
import React from 'react'

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export function DrawQuestion({ testIndex, q, qIndex, answers, dispatch }) {

  const drawAnswer = (a, aIndex, qIndex) => {
    return (
      <div key={"answer" + testIndex + qIndex + aIndex}>
        <FormControlLabel
          control={
            <Checkbox
              color={answers ? "primary" : "secondary"}
              checked={a.checked}
              onChange={answers ? null : (event) =>
                dispatch({ type: "handleCheckbox", event: event, qIndex: qIndex, aIndex: aIndex })
              }
            />
          }
          label={answers ? null : a.text}
        />
        {answers ?
          <FormControlLabel
            control={
              <GreenCheckbox
                checked={a.correct}
              />
            }
            label={answers ? a.text : null} /> :
          null}
        <br />
      </div>
    )
  }

  return (<Paper>
    <div>
      {q.text} <br />
      {q.answers.map((a, aIndex) => {
        return (drawAnswer(a, aIndex, qIndex))
      })}
    </div>
  </Paper>)

}

export const MemoizedDrawQuestion = React.memo(DrawQuestion)