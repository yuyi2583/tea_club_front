import React from 'react';
import './style.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as appActions, getError, getRequestQuantity } from "../../redux/modules/app";
import { getAuth } from "../../redux/modules/auth";
import { actions as uiActions, getClientHeight, getClientWidth } from "../../redux/modules/ui";
import { map  } from "../../router";
import asyncComponent from "../../utils/AsyncComponent";
import connectRoute from "../../utils/connectRoute";

const AsyncAdmin=connectRoute(asyncComponent(()=>import("../Admin")));
const AsyncClient=connectRoute(asyncComponent(()=>import("../Client")))

class App extends React.Component {

  componentDidMount(){
    let {clientWidth,clientHeight}=document.documentElement;
    this.props.setClientSize(clientWidth,clientHeight);
  }
  render() {
    return (
      <div style={{ width: this.props.clientWidth + "px", height: this.props.clientHeight + "px",overflow:"hidden" }}>
        <Router>
          <Switch>
            <Route path={map.admin.AdminHome()} component={AsyncAdmin}/>
            <Route path={map.client.ClientHome()} component={AsyncClient}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    error: getError(state),
    requestQuantity: getRequestQuantity(state),
    auth: getAuth(state),
    clientWidth: getClientWidth(state),
    clientHeight: getClientHeight(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators({...appActions,...uiActions}, dispatch)
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
