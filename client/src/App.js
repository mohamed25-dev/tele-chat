import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import {Chat, Register, Login, Password} from './views';
import NotFound from './views/NotFound';
import Auth from 'Auth';
import AppRoute from 'AppRoute';

function App() {
  useEffect(() => {
    Auth.init();
  }, [])

  return (
    <div id="main-container" className="container-fluid">
      <Router>
        <Switch>
          <AppRoute path='/' exact component={Chat} can={Auth.auth} redirect='/login'/>
          <AppRoute path='/password' exact component={Password} can={Auth.auth} redirect='/login'/>
          <AppRoute path='/register' component={Register} can={Auth.guest} redirect='/'/>
          <AppRoute path='/login' component={Login} can={Auth.guest} redirect='/'/>
          <Router component={NotFound}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
