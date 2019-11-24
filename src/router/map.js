import asyncComponent from "../utils/AsyncComponent";
import connectRoute from "../utils/connectRoute";

const ADMIN="/administrator";

//代码分片，将工程中所有的Route下渲染的组件都使用这种方法代替
const component = {
    AdminLogin: connectRoute(asyncComponent(() => import("../containers/Admin/Login"))),
    AdminHome: connectRoute(asyncComponent(() => import("../containers/Admin/Home"))),
    AdminForget:connectRoute(asyncComponent(()=>import("../containers/Admin/ForgetPsw"))),
}

export const NotFound = connectRoute(asyncComponent(() => import("../components/NotFound")));

export const map = {
    AdminHome:()=>ADMIN,
    AdminLogin:()=>ADMIN+"/login",
    AdminForgetPsw:()=>ADMIN+"/forget",
    ClientHome:()=>"/",
    ClientLogin:()=>"/login",
};

/**
 * auth:此路由是否需要登录验证
 * isClient:需要登录验证的路由是否是顾客登录验证（否则是职员登录验证）
 */
export default [
    { path: map.AdminHome(), name: "AdminHome", component: component.AdminHome, auth: true },
    { path: map.AdminLogin(), name: "AdminLogin", component: component.AdminLogin },
    { path: map.AdminForgetPsw(), name: "AdminForget", component: component.AdminForget },
]