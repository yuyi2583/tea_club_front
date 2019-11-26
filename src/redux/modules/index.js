import { combineReducers } from "redux";
import adminAuth from "./adminAuth";
import app from "./app";
import ui from "./ui";


// 合并所有模块的reducer成一个根reducer
const rootReducer=combineReducers({
    adminAuth,
    app,
    ui,
});

export default rootReducer;