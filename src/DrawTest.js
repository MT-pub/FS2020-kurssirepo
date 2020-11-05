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
    return (<Paper key={props.data[props.testIndex].tentti + qIndex}>
      <div>
        {q.kysymys} <br />
        {q.vastaukset.map((item, index) => {
          return (drawAnswer(item, index, qIndex))
        })}
      </div>
    </Paper>)
  }

  const drawAnswer = (a, aIndex, qIndex) => {
    return (
      <div key={a.vastaus + props.testIndex + qIndex + aIndex}>
        <FormControlLabel
          control={
            <Checkbox
              color={props.answers ? "primary" : "secondary"}
              checked={a.valittu}
              onChange={props.answers ? null : (event) => props.handleCheckbox(event, qIndex, aIndex)}
            />
          }
          label={props.answers ? null : a.vastaus}
        />
        {props.answers ?
          <FormControlLabel
            control={
              <GreenCheckbox
                checked={a.oikea}
              />
            }
            label={props.answers ? a.vastaus : null} /> :
          null}
        <br />
      </div>
    )
  }

  if (props.testIndex !== "") {
    //console.log(props.data[props.testIndex].tentti)
    return (
      <>
        {props.data[props.testIndex].kysymykset.map((item, index) => {
          return (drawQuestion(item, index));
        })}
        {props.answers ? null : <div>
          <Button key={props.data[props.testIndex].tentti + "showAnswers"}
            variant="contained"
            color="primary" onClick={() => { props.showAnswers() }}>
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