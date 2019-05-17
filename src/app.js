import React, { lazy, Suspense } from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import {
  Route as BasicRoute,
  Switch,
  Router
  // Redirect,
} from 'react-router-dom';
import { Provider } from 'mobx-react';
import { hot } from 'react-hot-loader/root';
import { createBrowserHistory } from 'history';
import NoMatch from 'containers/no-match';
import Layout from 'containers/layout';
import Loading from 'components/loading';
import 'common/common.css';
import store from 'store';

const Home = lazy(() => import(/* webpackChunkName: "Home" */ 'containers/home'));
const Home1 = lazy(() => import(/* webpackChunkName: "Home1" */ 'containers/home/home1.js'));

const history = createBrowserHistory();

const Route = ({ path, exact, component: Component }) => (
  <Suspense fallback={<Loading />}>
    <BasicRoute
      exact={exact}
      path={path}
      render={props => {
        return <Component {...props} />;
      }}
    />
  </Suspense>
);

Route.propTypes = {
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool.isRequired,
  component: PropTypes.object.isRequired
};

const App = () => (
  <Provider {...store}>
    <Router history={history}>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home1" component={Home1} />
          <BasicRoute component={NoMatch} />
        </Switch>
      </Layout>
    </Router>
  </Provider>
);

export default hot(App);
