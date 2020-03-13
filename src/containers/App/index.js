import React from 'react';
import './style.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as appActions, getError, getRetrieveRequestQuantity, getCompanyInfo } from "../../redux/modules/app";
import { getAuth } from "../../redux/modules/adminAuth";
import { actions as uiActions, getClientHeight, getClientWidth } from "../../redux/modules/ui";
import { map } from "../../router";
import asyncComponent from "../../utils/AsyncComponent";
import connectRoute from "../../utils/connectRoute";
import { throwStatement } from '@babel/types';

const AsyncAdmin = connectRoute(asyncComponent(() => import("../Admin")));
const AsyncClient = connectRoute(asyncComponent(() => import("../Client")));
const AsyncNotFound = connectRoute(asyncComponent(() => import("../../components/NotFound")));

class App extends React.Component {

  componentDidMount() {
    let { clientWidth, clientHeight } = document.documentElement;
    this.props.setClientSize(clientWidth, clientHeight);
  }
  render() {
    const { companyInfo,requestQuantity } = this.props;
    return (
      <div style={{ width: this.props.clientWidth + "px", height: this.props.clientHeight + "px", overflow: "hidden" }}>
        <Router>
          <Switch>
            <Route path={map.error()} exact component={AsyncNotFound} />
            <Route path={map.admin.AdminHome()} component={AsyncAdmin} />
            {/* <Route path={map.client.ClientHome()} component={AsyncClient} companyInfo={companyInfo} /> */}
          </Switch>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    error: getError(state),
    // requestQuantity: getRetrieveRequestQuantity(state),
    auth: getAuth(state),
    clientWidth: getClientWidth(state),
    clientHeight: getClientHeight(state),
    // companyInfo: getCompanyInfo(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(appActions, dispatch),
    ...bindActionCreators(uiActions, dispatch)
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
