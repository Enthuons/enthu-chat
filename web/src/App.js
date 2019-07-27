import React, { Component } from 'react';
import { Route, Router , Switch} from 'react-router-dom';
import Callback from './Callback/Callback';
import history from './history';
import Auth from './Auth/Auth';
import './App.css';
import Chat from './component/Chat';
import Logout from './component/Logout';
import Input from './component/Input';
import Verify from './component/verifymail';
import { Row, Col  } from 'react-bootstrap';

const auth = new Auth();
const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Container-fluid>
          <Row noGutters>
            <Col xl={6} lg={6} sm={12} className="offset-lg-3 offset-xl-3" >
              <div className="background" >
                <Router history={history} >
                  <Switch>
                    <Route path="/" render={(props) => {
                      const { isAuthenticated, renewSession} = auth;
                      if (!isAuthenticated()) {
                        if (localStorage.getItem('isLoggedIn') === 'true') {
                          renewSession();
                          //  return <Callback {...props} />
                        }
                        auth.login();
                        return <Callback {...props} />
                      }
                      return <Chat auth={auth} {...props} />
                    }} exact />

                    <Route path="/callback" render={(props) => {
                      handleAuthentication(props);
                      return <Callback {...props} exact/>
                    }} />

                    <Route path="/logout" component={<Logout auth={auth} />} exact />
                    <Route path="/input" component={<Input auth={auth} />} exact />
                    <Route path="/verifymail" component={(props) => <Verify auth={auth} {...props} />} exact />
                  </Switch>
                </Router>
              </div>
            </Col>
          </Row>
        </Container-fluid>
      </div>
    );
  }
}

export default App;
