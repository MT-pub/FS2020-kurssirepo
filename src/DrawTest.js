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

function DrawTest(props) {
  const drawQuestion = (q, qIndex) => {
    return (<Paper key={"question" + props.testIndex + qIndex}>
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
      <div key={"answer" + props.testIndex + qIndex + aIndex}>
        <FormControlLabel
          control={
            <Checkbox
              color={props.answers ? "primary" : "secondary"}
              checked={a.checked}
              onChange={props.answers ? null : (event) => props.handleCheckbox(event, qIndex, aIndex)}
            />
          }
          label={props.answers ? null : a.answer}
        />
        {props.answers ?
          <FormControlLabel
            control={
              <GreenCheckbox
                checked={a.correct}
              />
            }
            label={props.answers ? a.answer : null} /> :
          null}
        <br />
      </div>
    )
  }

  if (props.testIndex !== "") {
    //console.log(props.test.test)
    return (
      <>
        {props.testData.questions.map((item, index) => {
          return (drawQuestion(item, index));
        })}
        {props.answers ? null : <div>
          <Button key={props.testData.test + "showAnswers"}
            variant="contained"
            color="primary" onClick={() => { props.showAnswers() }}>
            Näytä answers
          </Button>
        </div>}
      </>
    )
  } else {
    return null
  }
}

export default DrawTest;