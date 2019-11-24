import { actions as appActions } from "./app";
import { post, get } from "../../utils/request";
import url from "../../utils/url";

export const USERTYPE = {
    CLIENT: 1,
    ADMIN: 2
}
const initialState = {
    userId: null,
    userName: null,
    userType: null
};

//action types
export const types = {
    LOGIN: "AUTH/LOGIN",   //登录
    LOGOUT: "AUTH/LOGOUT"  //注销
};

//action creators
export const actions = {
    forgetPsw: (phoneNumber, verifyNumber, idNumber, password) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { phoneNumber, verifyNumber, idNumber, password};
            return get(url.adminForget(), params).then((data) => {
                dispatch(appActions.finishRequest());
                if (!data.error) {
                    dispatch(actions.setLoginInfo(data.user.userId, data.user.userName, data.user.userType));
                } else {
                    dispatch(appActions.setError(data.error));
                }
            })
        }
    },
    //异步action，执行登录验证
    login: (userId, password) => {
        return (dispatch) => {
            // 每个API请求开始前，发送app模块定义的startRequest action
            dispatch(appActions.startRequest());
            const params = { userId, password };
            return get(url.adminLogin(), params).then((data) => {
                // 每个API请求结束后，发送app模块定义的finishRequest action
                dispatch(appActions.finishRequest());
                // 请求返回成功，保存登录用户的信息，否则，设置全局错误信息
                if (!data.error) {
                    dispatch(actions.setLoginInfo(userId, data.user.userName, data.user.userType));
                } else {
                    dispatch(appActions.setError(data.error));
                }
            });
        }

    },
    logout: () => ({
        type: types.LOGOUT
    }),
    setLoginInfo: (userId, userName, userType) => ({
        type: types.LOGIN,
        userId: userId,
        userName: userName,
        userType: userType
    })
};

//reducers
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOGIN:
            return { ...state, userId: action.userId, userName: action.userName, userType: action.userType };
        case types.LOGOUT:
            return { ...state, userId: null, userName: null, userType: null };
        default:
            return state;
    }
};

export default reducer;

//selector
export const getAuth = (state) => state.auth;