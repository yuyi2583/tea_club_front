import React from "react";
import { Switch, Route,Redirect } from "react-router-dom";
import Routers, { NotFound,map } from "../../router";
import connectRoute from "../../utils/connectRoute";
import asyncComponent from "../../utils/AsyncComponent";

const AsyncLogin=connectRoute(asyncComponent(()=>import("./Login")));
const AsyncForget=connectRoute(asyncComponent(()=>import("./ForgetPsw")));
const AsyncApp=connectRoute(asyncComponent(()=>import("./App")));

function Admin() {
    return (
        <Switch>
            <Route path={map.admin.AdminLogin()} exact component={AsyncLogin}/>
            <Route path={map.admin.AdminForgetPsw()} exact component={AsyncForget}/>
            <Route path={map.admin.AdminHome()}  component={AsyncApp}/>
            {/* {Routers.map((item, index) => {
                return <Route key={index} path={item.path} exact render={(props) => (
                    !item.auth ? <item.component {...props} /> : this.props.auth.userId ? <item.component {...props} /> :
                        item.isClient ? <Redirect to={{
                            pathname: map.ClientLogin(),
                            state: { from: props.location }
                        }} /> :
                            <Redirect to={{
                                pathname: map.AdminLogin(),
                                state: { from: props.location }
                            }} />
                )} />
            })}
            // 所有错误路由跳转页面
            <Route component={NotFound} /> */}
        </Switch>
    )
}

export default Admin;