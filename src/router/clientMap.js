import asyncComponent from "../utils/AsyncComponent";
import connectRoute from "../utils/connectRoute";

const ADMIN="/administrator";

//代码分片，将工程中所有的Route下渲染的组件都使用这种方法代替
const component = {
    AdminLogin: connectRoute(asyncComponent(() => import("../containers/Admin/Login"))),
    AdminHome: connectRoute(asyncComponent(() => import("../containers/Admin/Home"))),
    AdminForget:connectRoute(asyncComponent(()=>import("../containers/Admin/ForgetPsw"))),
}

export const map = {
    ClientHome:()=>"/",
    ClientLogin:()=>"/login",
};

/**
 * auth:此路由是否需要登录验证
 */
export default [
   
]