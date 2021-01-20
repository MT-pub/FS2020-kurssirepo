import { TextField, Button } from '@material-ui/core'
import { FormattedMessage } from 'react-intl';
import {useState} from 'react'


function LoginPage({ state, login }) {

  const [username, setUserName] = useState("miika@tolonen.fi");
  const [password, setPassword] = useState("salainensana");

  return (
    <div>
      <form>
        <span>
          Käyttäjänimi:<br />
        </span>
        <TextField
          defaultValue="miika@tolonen.fi"
          onChange={e => setUserName(e.target.value)}
          variant="outlined" />
        <span>
          Salasana:
      </span>
        <TextField
          defaultValue="salainensana"
          onChange={e => setPassword(e.target.value)}
          type="password"
          variant="outlined" />
        <Button key={"Login-Button"}
          type="submit"
          variant="contained"
          color="primary" onClick={(e) => { login(e, username, password) }}>
          <FormattedMessage id="app.login-button" defaultMessage="Kirjaudu" description="Tests-button on AppBar" />
        </Button>
      </form>
      {state.file === 1 ? <img src="http://localhost:4000/static/testfile.jpeg" /> : null}
    </div>
  )

}

export default LoginPage