import { Paper, Checkbox, TextField, IconButton, Icon } from '@material-ui/core'
import { FormattedMessage } from 'react-intl';


function EditTest({ testData, testIndex, dispatch }) {
  const drawQuestion = (q, qIndex) => {
    return (
      <Paper key={"question" + testIndex + qIndex}
        className="questionCard">
        <div>
          <TextField
            className="questionItem"
            value={q.question}
            onChange={(event) =>
              dispatch({ type: "handleQuestion", event: event, qIndex: qIndex })}
            variant="outlined" />
          <IconButton size="medium"
            onClick={() =>
              dispatch({ type: "removeQuestion", qIndex: qIndex })}>
            <Icon>delete</Icon>
          </IconButton>
          <br />
          {q.answers.map((item, index) => {
            return (drawAnswer(item, index, qIndex))
          })}
          <br />
          <IconButton size="medium"
            className="answer"
            onClick={() =>
              dispatch({ type: "addAnswer", qIndex: qIndex })}>
            <Icon>add-circle</Icon>
            <span>&nbsp;Lisää vastaus</span>
          </IconButton>
        </div>
      </Paper>)
  }

  const drawAnswer = (a, aIndex, qIndex) => {
    return (
      <div key={"answer" + testIndex + qIndex + aIndex}>
        <Checkbox
          color={"secondary"}
          checked={a.correct}
          onChange={(event) =>
            dispatch({ type: "handleCheckbox", event: event, qIndex: qIndex, aIndex: aIndex })}
        />
        <TextField
          className="answerItem"
          value={a.answer}
          onChange={(event) =>
            dispatch({ type: "handleAnswer", event: event, qIndex: qIndex, aIndex: aIndex })}
          variant="outlined" />
        <IconButton size="medium"
          onClick={() =>
            dispatch({ type: "removeAnswer", qIndex: qIndex, aIndex: aIndex })}>
          <Icon>delete</Icon>
        </IconButton>
        <br />
      </div>
    )
  }

  /* console.log("testData: ",testData)
  console.log("testIndex: ",testIndex) */
  if (testIndex !== "") {
    //console.log(testData.test)
    return (
      <>
        <TextField
          className="questionItem"
          value={testData.test}
          onChange={(event) =>
            dispatch({ type: "handleTest", event: event })}
          variant="outlined" />
        <IconButton size="medium"
          onClick={() =>
            dispatch({ type: "removeTest" })}>
          <Icon>delete</Icon>
        </IconButton>
        {testData.questions.map((item, index) => {
          return (drawQuestion(item, index));
        })}
        <IconButton size="medium"
          className="answer"
          onClick={() =>
            dispatch({ type: "addQuestion" })}>
          <Icon>add-circle</Icon>
          <FormattedMessage id="app.add-question-button" description="Tests-button on AppBar">
            {txt => <span>&nbsp;{txt}</span>}
            </FormattedMessage>
        </IconButton>
      </>
    )
  } else {
    return null
  }
}

export default EditTest;