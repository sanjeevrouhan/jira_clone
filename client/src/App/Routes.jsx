/* eslint-disable no-shadow */
import React, { createContext, useContext, useMemo, useState, useNavigate, useEffect } from 'react';
import { Router, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import history from 'browserHistory';
import Project from 'Project';
import Authenticate from 'Auth/Authenticate';
// import PageError from 'shared/components/PageError';
import Login from 'Auth/Login';
import useCurrentUser from 'shared/hooks/currentUser';
import { PageError } from 'shared/components';

export const AppContext = createContext(null);
const Layout = ({ history, component: Component, ...rest }) => {
  const { setApp } = useContext(AppContext);
  const { currentUser } = useCurrentUser();
  useEffect(() => {
    if (currentUser) {
      setApp({ user: currentUser });
    }
  }, [currentUser]);

  if(currentUser){
    return <Redirect to="/project/board" />;
  }

  return <Route {...rest} render={matchProps => <Component {...matchProps} />} />;
};

// Can be 1 layout but using 2 for future use
const PrivateLayout = ({ history, component: Component, ...rest }) => {
  const { app, setApp } = useContext(AppContext);
  const { currentUser } = useCurrentUser();
  useEffect(() => {
    if (currentUser) {
      setApp({ user: currentUser });
    }
  }, [currentUser]);
  if (!app) {
    return <Redirect to="/login" />;
  }
  return <Route exact {...rest} render={matchProps => <Component {...matchProps} />} />;
};

const Routes = () => {
  const [app, setApp] = useState(null);
  const appValue = useMemo(() => ({ app, setApp }), [app, setApp]);
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <AppContext.Provider value={appValue}>
          <Layout path="/login" component={Login} />
          <PrivateLayout path="/authenticate" component={Authenticate} />
          <PrivateLayout path="/project" component={Project} />
          {/* <Redirect exact from="/" to="/project" /> */}
          {/* <Route path="/authenticate" component={Authenticate} /> */}
          <Route path="/project" component={Project} />
          {/* <Route component={PageError} />  */}
        </AppContext.Provider>
      </Switch>
    </Router>
  );
};

export default Routes;
