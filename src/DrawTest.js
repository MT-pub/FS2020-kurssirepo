import { Paper, Checkbox, FormControlLabel, Button } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { withStyles } from '@material-ui/core/styles';

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

function DrawTest({ testData, testIndex, answers, dispatch }) {
  const drawQuestion = (q, qIndex) => {
    return (<Paper key={"question" + testIndex + qIndex}>
      <div>
        {q.question} <br />
        {q.answers.map((item, index) => {
          return (drawAnswer(item, index, qIndex))
        })}
      </div>
    </Paper>)
  }

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
          label={answers ? null : a.answer}
        />
        {answers ?
          <FormControlLabel
            control={
              <GreenCheckbox
                checked={a.correct}
              />
            }
            label={answers ? a.answer : null} /> :
          null}
        <br />
      </div>
    )
  }

  if (testIndex !== "") {
    //console.log(props.test.test)
    return (
      <>
        {testData.questions.map((item, index) => {
          return (drawQuestion(item, index));
        })}
        {answers ? null : <div>
          <Button key={testData.test + "showAnswers"}
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