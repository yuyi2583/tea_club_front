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
            <Route path={map.admin.AdminHome()}  component={AsyncApp} />
        </Switch>
    )
}

export default Admin;