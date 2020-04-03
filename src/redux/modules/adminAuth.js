import { actions as appActions } from "./app";
import { post, get } from "../../utils/request";
import url from "../../utils/url";
import { map, dynamicRoute } from "../../router";
import { requestType } from "../../utils/common";

const initialState = {
    user: new Object(),
    authorities: new Array(),
    byAuthorities: new Object(),
    authorityBelong: new Array(),
    byAuthorityBelong: new Object(),
};

//action types
export const types = {
    LOGIN: "AUTH/LOGIN",                    //登录
    SEND_OTP: "AUTH/SEND_OTP",//发送短信验证码
    ////////////////////////////
    LOGOUT: "AUTH/LOGOUT",                  //注销
    CHECK_AUTHORITY: "AUTH/CHECK_AUTHORITY"  //检查权限
};

//action creators
export const actions = {
    //职员身份证密码登陆
    idPswLogin: ({ identityId, password }) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { identityId, password };
            return post(url.idPswLogin(), params).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(loginSuccess(convertAuthorityToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.error));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //发送短信验证码
    sendClerkOtp: (contact) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(requestType.modalRequest));
            return post(url.sendClerkOtp(contact)).then((result) => {
                dispatch(appActions.finishRequest(requestType.modalRequest));
                if (!result.error) {
                    dispatch(sendOtpSuccess());
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.error));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //短信验证码登陆
    otpLogin: ({ contact, otp }) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return post(url.otpLogin(contact,otp)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(loginSuccess(convertAuthorityToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.error));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    ////////////////////////////////////////
    forgetPsw: (phoneNumber, verifyNumber, idNumber, password) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { phoneNumber, verifyNumber, idNumber, password };
            return get(url.adminForget(), params).then((data) => {
                dispatch(appActions.finishRequest());
                if (!data.error) {
                    dispatch(actions.setLoginInfo({ ...data.user }));
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
            return get(url.adminLogin(), params).then((result) => {
                // 每个API请求结束后，发送app模块定义的finishRequest action
                dispatch(appActions.finishRequest());
                // 请求返回成功，保存登录用户的信息，否则，设置全局错误信息
                if (!result.error) {
                    const { userId, userName, authority, authorityBelong } = convertAuthorityToPlainStructure(result.data);
                    dispatch(actions.setLoginInfo(userId, userName, authority, authorityBelong));
                } else {
                    dispatch(appActions.setError(result.msg));
                }
            });
        }

    },
    logout: () => ({
        type: types.LOGOUT
    }),
    setLoginInfo: (userId, userName, authority, authorityBelong) => ({
        type: types.LOGIN,
        userId,
        userName,
        authority,
        authorityBelong
    })
};

const convertAuthorityToPlainStructure = (data) => {
    let authorities = new Array();
    let byAuthorities = new Object;
    let authorityBelong = new Array()
    let byAuthorityBelong = new Object();
    data.authorities.forEach((item) => {
        authorities.push(item.uid);
        authorityBelong.push(item.uid);
        byAuthorities[item.uid] = {
            ...item,
            belong: item.belong.uid,
            pathname: map.admin.AdminHome() + "/" + item.belong.name + "/" + item.name
        };
        if (!byAuthorityBelong[item.belong.uid]) {
            byAuthorityBelong[item.belong.uid] = item.belong;
        }
    });

    //根据账户权限动态配置路由
    byAuthorities = dynamicRoute(byAuthorities);
    return {
        user: { ...data, authorities },
        byAuthorities,
        authorityBelong,
        byAuthorityBelong
    };
}

const loginSuccess = ({ user, byAuthorities, byAuthorityBelong }) => ({
    type: types.LOGIN,
    user,
    byAuthorities,
    byAuthorityBelong
})

const sendOtpSuccess = () => ({
    type: types.SEND_OTP
})

//reducers
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOGIN:
            return { ...state, user: action.user, byAuthorities: action.byAuthorities, byAuthorityBelong: action.byAuthorityBelong, authorityBelong: action.authorityBelong };
        ///////////////////////////////
        case types.LOGOUT:
            return { ...state, userId: null, userName: null, authority: [] };
        default:
            return state;
    }
};

export default reducer;

//selector
export const getUser = (state) => state.adminAuth.user;
export const getByAuthorities = (state) => state.adminAuth.byAuthorities;
export const getByAuthorityBelong = (state) => state.adminAuth.byAuthorityBelong;
export const getAuthorityBelong = (state) => state.adminAuth.authorityBelong;
//////////////////////////////////////
// export const getAuth = (state) => state.adminAuth;
// //将权限类别转为数组
// export const getAuthorityBelong = (state) => {
//     const { authorityBelong } = state.adminAuth;
//     let byAuthorityBelong = [];
//     for (var key in authorityBelong) {
//         byAuthorityBelong.push(authorityBelong[key]);
//     }
//     return byAuthorityBelong;
// }
// //将权限转为数组
// export const getAuthority = (state) => {
//     const { authority } = state.adminAuth;
//     let byAuthority = [];
//     for (var key in authority) {
//         byAuthority.push(authority[key]);
//     }
//     return byAuthority;
// }