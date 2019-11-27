import { actions as appActions } from "./app";
import { post, get } from "../../utils/request";
import url from "../../utils/url";
import {map,dynamicRoute} from "../../router";

const initialState = {
    userId: null,
    userName: null,
    authority: {},
    authorityBelong:[],
    hasAuthority:false,
};

//action types
export const types = {
    LOGIN: "AUTH/LOGIN",                    //登录
    LOGOUT: "AUTH/LOGOUT",                  //注销
    CHECK_AUTHORITY:"AUTH/CHECK_AUTHORITY"  //检查权限
};

//action creators
export const actions = {
    //检查是否有权限
    checkAuthority:(flag)=>{
        
    },
    forgetPsw: (phoneNumber, verifyNumber, idNumber, password) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { phoneNumber, verifyNumber, idNumber, password };
            return get(url.adminForget(), params).then((data) => {
                dispatch(appActions.finishRequest());
                if (!data.error) {
                    dispatch(actions.setLoginInfo({...data.user}));
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
                    const {userId,userName,authority,authorityBelong}=convertToPlainStructure(data);
                    dispatch(actions.setLoginInfo(userId, userName,authority,authorityBelong));
                } else {
                    dispatch(appActions.setError(data.error));
                }
            });
        }

    },
    logout: () => ({
        type: types.LOGOUT
    }),
    setLoginInfo: (userId, userName,authority,authorityBelong) => ({
        type: types.LOGIN,
        userId,
        userName,
        authority,
        authorityBelong
    })
};

const convertToPlainStructure=(data)=>{
    const {userId,userName,authority}=data.user;
    let byAuthority={};
    let byAuthorityBelong={};
    authority.forEach((item)=>{
        byAuthority[item.id]={
            ...item,
            belong:item.belong.id,
            pathname:map.admin.AdminHome()+"/"+item.belong.name+"/"+item.name
        };
        if(!byAuthorityBelong[item.belong.id]){
            byAuthorityBelong[item.belong.id]=item.belong;
        }
    });
    byAuthority=dynamicRoute(byAuthority);
    return {
        userId,
        userName,
        authority:byAuthority,
        authorityBelong:byAuthorityBelong,
    };
}

//reducers
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOGIN:
            return { 
                ...state, 
                userId: action.userId, 
                userName: action.userName,
                authority:action.authority,
                authorityBelong:action.authorityBelong 
            };
        case types.LOGOUT:
            return { ...state, userId: null, userName: null,authority:[] };
        default:
            return state;
    }
};

export default reducer;

//selector
export const getAuth = (state) => state.adminAuth;
//将权限类别转为数组
export const getAuthorityBelong=(state)=>{
    const {authorityBelong}=state.adminAuth;
    let byAuthorityBelong=[];
    for (var key in authorityBelong){
        byAuthorityBelong.push(authorityBelong[key]);
    }
    return byAuthorityBelong;
}
//将权限转为数组
export const getAuthority=(state)=>{
    const {authority}=state.adminAuth;
    let byAuthority=[];
    for(var key in authority){
        byAuthority.push(authority[key]);
    }
    return byAuthority;
}