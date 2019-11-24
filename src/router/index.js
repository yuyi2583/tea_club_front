import asyncComponent from "../utils/AsyncComponent";
import connectRoute from "../utils/connectRoute";
import adminRouters,{map as adminMap} from "./adminMap";
import clientRouters,{map as clientMap} from "./clientMap";

export const NotFound = connectRoute(asyncComponent(() => import("../components/NotFound")));

export const map = {
    admin:adminMap,
    client:clientMap
};


export default {
    admin:adminRouters,
    client:clientRouters
}