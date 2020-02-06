import url from "../../utils/url";
import { get } from "../../utils/request";
import { actions as uiActions } from "./ui";
import { requestType } from "../../utils/common";

const initialState = {
    requestQuantity: 0,     //当前应用中正在进行的API请求数
    error: null,            //应用全局错误信息
    companyInfo: null,             //页脚公司信息
    modalRequestQuantity: 0, //modal中正在进行的API请求数
}

//action types
export const types = {
    START_REQUEST: "APP/START_REQUEST",                 //开始发送请求
    FINISH_REQUEST: "APP/FINISH_REQUEST",               //请求结束
    SET_ERROR: "APP/SET_ERROR",                         //设置错误信息
    REMOVE_ERROR: "APP/REMOVE_ERROR",                   //删除错误信息
    SET_COMPANY_INFO: "APP/SET_COMPANY_INFO",            //设置公司信息
    REMOVE_COMPANY_INFO: "APP/REMOVE_COMPANY_INFO",      //删除公司信息
    START_MODAL_REQUEST: "APP/START_MODAL_REQUEST",      //在modal发送请求
    FINISH_MODAL_REQUEST: "APP/FINISH_MODAL_REQUEST",    //在modal中结束请求
    // ALTER_COMPANY:"APP/ALTER_COMPANY",       //
};

//action creators
export const actions = {
    startRequest: (reqType = requestType.appRequest) => {
        switch (reqType) {
            case requestType.modalRequest:
                return startModalRequest();
                break;
            default:
                return startAppRequest();
                break;
        }
    },
    finishRequest: (reqType = requestType.appRequest) => {
        switch (reqType) {
            case requestType.modalRequest:
                return finishModalRequest();
                break;
            default:
                return finishAppRequest();
                break;
        }
    },
    setError: (error) => ({
        type: types.SET_ERROR,
        error
    }),
    removeError: () => ({
        type: types.REMOVE_ERROR
    }),
    //获取公司信息
    getCompanyInfo: () => {
        return (dispatch) => {
            dispatch(actions.startRequest());
            return get(url.companyInfo()).then((data) => {
                dispatch(actions.finishRequest());
                if (!data.error) {
                    dispatch(actions.setCompanyInfo(data.companyInfo));
                } else {
                    dispatch(actions.setError(data.error));
                }
            })
        }
    },
    //修改公司信息
    alterCompanyInfo: (companyInfo) => {
        return (dispatch) => {
            dispatch(actions.startRequest());
            const params = { ...companyInfo };
            return get(url.companyInfo(), params).then((data) => {
                dispatch(actions.finishRequest());
                if (!data.error) {
                    dispatch(actions.setCompanyInfo(companyInfo));
                } else {
                    dispatch(actions.setError(data.error));
                }
                dispatch(uiActions.finishAlterInfo());
            })
        }
    },
    setCompanyInfo: (companyInfo) => ({
        type: types.SET_COMPANY_INFO,
        companyInfo
    }),
    removeCompanyInfo: () => ({
        type: types.REMOVE_COMPANY_INFO
    }),
}

const startModalRequest = () => ({
    type: types.START_MODAL_REQUEST,
});
const finishModalRequest = () => ({
    type: types.FINISH_MODAL_REQUEST,
});

const startAppRequest = () => ({
    type: types.START_REQUEST
});

const finishAppRequest = () => ({
    type: types.FINISH_REQUEST
});

//reducers
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.START_REQUEST:
            //每接收一个API请求开始的action，requestQuantity+1
            return { ...state, requestQuantity: state.requestQuantity + 1 };
        case types.FINISH_REQUEST:
            // 每接收一个API请求结束的action，requestQuantity减1
            return { ...state, requestQuantity: state.requestQuantity <= 0 ? 0 : state.requestQuantity - 1 };
        case types.SET_ERROR:
            return { ...state, error: action.error };
        case types.REMOVE_ERROR:
            return { ...state, error: null };
        case types.SET_COMPANY_INFO:
            return { ...state, companyInfo: action.companyInfo };
        case types.REMOVE_COMPANY_INFO:
            return { ...state, companyInfo: {} };
        case types.START_MODAL_REQUEST:
            return { ...state, modalRequestQuantity: state.modalRequestQuantity + 1 };
        case types.FINISH_MODAL_REQUEST:
            return { ...state, modalRequestQuantity: state.modalRequestQuantity <= 0 ? 0 : state.modalRequestQuantity - 1 };
        default:
            return state;
    }
}

export default reducer;

//selectors
export const getError = (state) => {
    return state.app.error;
}

export const getRequestQuantity = (state) => {
    return state.app.requestQuantity;
}

export const getCompanyInfo = (state) => state.app.companyInfo;
export const getModalRequestQuantity = (state) => state.app.modalRequestQuantity;