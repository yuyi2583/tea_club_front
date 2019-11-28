import asyncComponent from "../utils/AsyncComponent";
import connectRoute from "../utils/connectRoute";
import adminRouters,{map as adminMap} from "./adminMap";
import clientRouters,{map as clientMap} from "./clientMap";

export const map = {
    admin:adminMap,
    client:clientMap,
    error:()=>"/error"
};

//根据账户权限动态配置路由
export const dynamicRoute=(data)=>{
    let authority=data;
    for(var key in authority){
        let a=authority[key].component;
        let component=connectRoute(asyncComponent(() => import(`../containers/${a}`)));
        authority[key].component=component;
    }
    return authority;
}


export default {
    admin:adminRouters,
    client:clientRouters,
}