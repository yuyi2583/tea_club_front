import asyncComponent from "../utils/AsyncComponent";
import connectRoute from "../utils/connectRoute";

const ADMIN="/administrator";

//代码分片，将工程中所有的Route下渲染的组件都使用这种方法代替
const component = {
    AdminHome: connectRoute(asyncComponent(() => import("../containers/Admin/Home"))),
}

export const NotFound = connectRoute(asyncComponent(() => import("../components/NotFound")));

export const map = {
    AdminHome:()=>ADMIN,
    AdminLogin:()=>ADMIN+"/login",
    AdminForgetPsw:()=>ADMIN+"/forget",
};

/**
 * auth:此路由是否需要登录验证
 */
export default [
    { path: map.AdminHome(), name: "AdminHome", component: component.AdminHome, auth: true },
]