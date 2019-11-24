import { combineReducers } from "redux";
import auth from "./auth";
import app from "./app";
import ui from "./ui";


// 合并所有模块的reducer成一个根reducer
const rootReducer=combineReducers({
    auth,
    app,
    ui,
});

export default rootReducer;