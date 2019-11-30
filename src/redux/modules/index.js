import { combineReducers } from "redux";
import adminAuth from "./adminAuth";
import app from "./app";
import ui from "./ui";
import shop from "./shop";
import clerk from "./clerk";


// 合并所有模块的reducer成一个根reducer
const rootReducer = combineReducers({
    adminAuth,
    app,
    ui,
    shop,
    clerk,
});

export default rootReducer;