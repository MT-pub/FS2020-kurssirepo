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
      <img src="../../server/files/testfile.jpeg" />
    </div>
  )

}

export default LoginPage