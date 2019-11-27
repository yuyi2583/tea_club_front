import asyncComponent from "../utils/AsyncComponent";
import connectRoute from "../utils/connectRoute";

const ADMIN="/administrator";

//代码分片，将工程中所有的Route下渲染的组件都使用这种方法代替
const component = {
    AdminHome: connectRoute(asyncComponent(() => import("../containers/Admin/Home"))),
    AdminAlterPsw:connectRoute(asyncComponent(()=>import("../containers/Admin/AlterPsw"))),
}

export const NotFound = connectRoute(asyncComponent(() => import("../components/NotFound")));



//通用路由map
export const map = {
    AdminHome:()=>ADMIN,
    AdminLogin:()=>ADMIN+"/login",
    AdminForgetPsw:()=>ADMIN+"/forget",
    AdminAlterPsw:()=>ADMIN+"/alterPsw",
};

/**
 * 此处路由为通用路由
 * 不同账户权限不同路由不同
 * 对应路由根据账户权限动态配置
 * auth:此路由是否需要登录验证
 */
export default [
    { path: map.AdminHome(), name: "AdminHome", component: component.AdminHome, auth: true },
    { path: map.AdminAlterPsw(), name: "AdminAlterPsw", component: component.AdminAlterPsw, auth: true },
]