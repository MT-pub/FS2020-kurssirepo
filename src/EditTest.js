import { Paper, Checkbox, TextField, IconButton, Icon } from '@material-ui/core'


function EditTest(props) {
  const drawQuestion = (q, qIndex) => {
    return (
      <Paper key={"question" + props.testIndex + qIndex}
        className="questionCard">
        <div>
          <TextField
            className="questionItem"
            value={q.question}
            onChange={(event) => props.handleQuestion(event, qIndex)}
            variant="outlined" />
          <IconButton size="medium"
            onClick={() => props.removeQuestion(qIndex)}>
            <Icon>delete</Icon>
          </IconButton>
          <br />
          {q.answers.map((item, index) => {
            return (drawAnswer(item, index, qIndex))
          })}
          <br />
          <IconButton size="medium"
            className="answer"
            onClick={() => props.addAnswer(qIndex)}>
            <Icon>add-circle</Icon>
            <span>&nbsp;Lisää vastaus</span>
          </IconButton>
        </div>
      </Paper>)
  }

  const drawAnswer = (a, aIndex, qIndex) => {
    return (
      <div key={"answer" + props.testIndex + qIndex + aIndex}>
        <Checkbox
          color={props.answers ? "primary" : "secondary"}
          checked={a.correct}
          onChange={(event) => props.handleCheckbox(event, qIndex, aIndex)}
        />
        <TextField
        className="answerItem"
          value={a.answer}
          onChange={(event) => props.handleAnswer(event, qIndex, aIndex)}
          variant="outlined" />
        <IconButton size="medium"
          onClick={() => props.removeAnswer(qIndex, aIndex)}>
          <Icon>delete</Icon>
        </IconButton>
        <br />
      </div>
    )
  }

  if (props.testIndex !== "") {
    //console.log(props.data[props.testIndex].test)
    return (
      <>
      <TextField
        className="questionItem"
          value={props.data[props.testIndex].test}
          onChange={(event) => props.handleTest(event)}
          variant="outlined" />
          <IconButton size="medium"
          onClick={() => props.removeTest()}>
          <Icon>delete</Icon>
        </IconButton>
        {props.data[props.testIndex].questions.map((item, index) => {
          return (drawQuestion(item, index));
        })}
        <IconButton size="medium"
          className="answer"
          onClick={() => props.addQuestion()}>
          <Icon>add-circle</Icon>
          <span>&nbsp;Lisää kysymys</span>
        </IconButton>
      </>
    )
  } else {
    return null
  }
}

export default EditTest;