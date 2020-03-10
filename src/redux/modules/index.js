import { combineReducers } from "redux";
import adminAuth from "./adminAuth";
import app from "./app";
import ui from "./ui";
import shop from "./shop";
import clerk from "./clerk";
import product from "./product";
import customer from "./customer";
import activity from "./activity";
import order from "./order";


// 合并所有模块的reducer成一个根reducer
const rootReducer = combineReducers({
    adminAuth,
    app,
    ui,
    shop,
    clerk,
    product,
    customer,
    activity,
    order,
});

export default rootReducer;