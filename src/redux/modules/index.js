import { combineReducers } from "redux";
import auth from "./auth";
import app from "./app";


// 合并所有模块的reducer成一个根reducer
const rootReducer=combineReducers({
    auth,
    app,
});

export default rootReducer;