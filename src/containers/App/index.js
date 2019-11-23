import React from 'react';
import './style.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Routers,{NotFound} from "../../router/map";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {actions as appActions, getError,getRequestQuantity} from "../../redux/modules/app";
import {getAuth} from "../../redux/modules/auth";
import {map} from "../../router/map";

class App extends React.Component {
  render(){
    return (
      <div>
        <Router>
          <Switch>
            {Routers.map((item,index)=>{
              return <Route key={index} path={item.path} exact render={(props)=>(
                !item.auth?<item.component {...props}/>:this.props.auth.userId?<item.component {...props}/>:
                item.isClient?<Redirect to={{
                  pathname:map.ClientLogin(),
                  state:{from:props.location}
                }} />:
                <Redirect to={{
                  pathname:map.AdminLogin(),
                  state:{from:props.location}
                }} />
              )}/>
            })}
            // 所有错误路由跳转页面
            <Route component={NotFound} />
          </Switch>
        </Router>
      </div>
    );
  }
}

const mapStateToProps=(state,props)=>{
  return {
    error:getError(state),
    requestQuantity:getRequestQuantity(state),
    auth:getAuth(state)
  }
}

const mapDispatchToProps=(dispatch)=>{
  return {
    ...bindActionCreators(appActions,dispatch)
  };
};


export default connect(mapStateToProps,mapDispatchToProps)(App);
