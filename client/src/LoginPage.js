import { TextField } from '@material-ui/core'


function LoginPage({ state, dispatch }) {

  return (
    <div>
      <span>
        Käyttäjänimi:
      </span>
      <TextField />
      <span>
        Salasana:
      </span>
      <TextField />
      {state.file === 1 ? <img src="http://localhost:4000/static/testfile.jpeg" /> : null}
    </div>
  )

}

export default LoginPage