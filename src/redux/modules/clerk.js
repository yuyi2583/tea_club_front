import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get } from "../../utils/request";
import { actions as uiActions } from "./ui";
import { requestType } from "../../utils/common";

const initialState = {
    clerks: new Array(),
    byClerks: new Object(),
    ///////////////////////
    byAuthority: null,
    byBelong: null,
    allAuthority: null,
    allBelong: null,
    allPosition: null,
    byAllPosition: null,
};

export const types = {
    FETCH_ALL_CLERKS: "CLERK/FETCH_ALL_CLERKS",          //获取所有员工信息
    FETCH_SHOP_CLERKS: "CLERK/FETCH_SHOP_CLERKS",        //获取门店员工信息
    /////////////////////////////////////////////
    ALTER_CLERK_POSITION: "CLERK/ALTER_CLERK_POSITION",      //修改员工职位信息
    FETCH_ALL_AUTHORITY: "CLERK/FETCH_ALL_AUTHORITY",        //获取所有权限信息
    FETCH_ALL_POSITION: "CLERK/FETCH_ALL_POSITION",          //获取所有职位信息
    ALTER_CLERK_INFO: "CLERK/ALTER_CLERK_INFO",              //修改职员信息
    DELETE_CLERK: "CLERK/DELETE_CLERK",                      //删除职员
    ADD_CLERK: "CLERK/ADD_CLERK",                            //添加职员
}

export const actions = {
    //获取所有员工数据
    fetchAllClerks: (reqType = requestType.retrieveRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            return get(url.fetchAllClerks()).then((result) => {
                dispatch(appActions.finishRequest(reqType));
                if (!result.error) {
                    dispatch(fetchAllClerksSuccess(convertClerksToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    fetchShopClerks: (clerks, byClerks) => ({
        type: types.FETCH_SHOP_CLERKS,
        clerks,
        byClerks
    }),
    ////////////////////////////////
    fetchClerks: (byClerks) => ({
        type: types.FETCH_SHOP_CLERKS,
        byClerks
    }),
    //用于门店管理中门店员工职位修改
    alterClerkPosition: (clerks = new Array(), managers = new Array()) => ({
        type: types.ALTER_CLERK_POSITION,
        clerks,
        managers
    }),
    //获取所有权限信息
    fetchAllAuthority: () => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchAllAuthority()).then((data) => {
                dispatch(appActions.finishRequest());
                if (!data.error) {
                    dispatch(fetchAllAuthoritySuccess(convertAuthorityToPlainStructure(data.authority)));
                } else {
                    dispatch(actions.setError(data.error));
                }
            })
        }
    },
    //获取所有职位信息
    fetchAllPosition: () => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchAllPosition()).then((data) => {
                dispatch(appActions.finishRequest());
                if (!data.error) {
                    dispatch(fetchAllPositionSuccess(convertPositionToPlainStructure(data.positions)));
                } else {
                    dispatch(actions.setError(data.error));
                }
            })
        }
    },
    //修改职员信息
    alterClerkInfo: (newClerkInfo) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { ...newClerkInfo };
            return get(url.alterClerkInfo(), params).then((data) => {
                dispatch(appActions.finishRequest());
                if (!data.error) {
                    let newInfo = new Object();
                    for (var key in params) {
                        if (key === "selectedAuthority" || key === "validateStatus") {
                            continue;
                        }
                        newInfo[key] = params[key];
                    }
                    dispatch(alterClerkInfoSuccess(newInfo));
                    dispatch(uiActions.finishAlterInfo());
                    return Promise.resolve();
                } else {
                    dispatch(actions.setError(data.error));
                    dispatch(uiActions.finishAlterInfo());
                    return Promise.reject(data.error);
                }
            })
        }
    },
    //删除职员
    deleteClerk: (clerkId) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { id: clerkId };
            return get(url.deleteClerk(), params).then((data) => {
                dispatch(appActions.finishRequest());
                if (!data.error) {
                    dispatch(deleteClerkSuccess(clerkId));
                    return Promise.resolve();
                } else {
                    dispatch(actions.setError(data.error));
                    return Promise.reject(data.error);
                }
            })
        }
    },
    //添加职员
    addClerk: (clerk) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { clerk };
            return get(url.addClerk(), params).then((data) => {
                dispatch(appActions.finishRequest());
                if (!data.error) {
                    dispatch(addClerkSuccess(convertClerksToPlainStructure(data.clerk)));
                    return Promise.resolve(data.clerk.uid);
                } else {
                    dispatch(actions.setError(data.error));
                    return Promise.reject(data.error);
                }
            })
        }
    }
}


const convertClerksToPlainStructure = (data) => {
    let clerks = new Array();
    let byClerks = new Object();
    data.forEach(clerk => {
        clerks.push(clerk.uid);
        if (!byClerks[clerk.uid]) {
            byClerks[clerk.uid] = clerk;
        }
    });
    return {
        clerks,
        byClerks
    }
}

const fetchAllClerksSuccess = ({ clerks, byClerks }) => ({
    type: types.FETCH_ALL_CLERKS,
    clerks,
    byClerks
})
///////////////////////////////////////

const addClerkSuccess = ({ clerks, byClerks, byAuthorityTop, byBelongTop }) => ({
    type: types.ADD_CLERK,
    clerks,
    byClerks,
    byAuthority: byAuthorityTop,
    byBelong: byBelongTop,
})

const deleteClerkSuccess = (id) => ({
    type: types.DELETE_CLERK,
    id
})

const alterClerkInfoSuccess = (newClerkInfo) => ({
    type: types.ALTER_CLERK_INFO,
    newClerkInfo
})

const fetchAllPositionSuccess = ({ allPosition, byAllPosition }) => ({
    type: types.FETCH_ALL_POSITION,
    allPosition,
    byAllPosition
})

const fetchAllAuthoritySuccess = ({ authority, byAuthority, byBelongSecond, belong }) => ({
    type: types.FETCH_ALL_AUTHORITY,
    allAuthority: authority,
    byAuthority,
    byBelong: byBelongSecond,
    allBelong: belong
})

// const fetchAllClerksSuccess = ({ clerks, byClerks, byAuthorityTop, byBelongTop }) => ({
//     type: types.FETCH_ALL_CLERKS,
//     clerks,
//     byClerks,
//     byAuthority: byAuthorityTop,
//     byBelong: byBelongTop,
// })

const convertPositionToPlainStructure = (data) => {
    console.log("all positins", data);
    let allPosition = [];
    let byAllPosition = {};
    data.forEach((item) => {
        allPosition.push(item.uid);
        if (!byAllPosition[item.uid]) {
            byAllPosition[item.uid] = item;
        }
    });
    return {
        allPosition,
        byAllPosition
    }
}

// const convertClerksToPlainStructure = (data) => {
//     console.log("length of data",data.length);
//     let clerks = [];
//     let byClerks = {};
//     let byAuthorityTop = new Object();
//     let byBelongTop = new Object();
//     if(data.length==undefined){
//         clerks.push(data.uid);
//         if (!byClerks[data.uid]) {
//             const { authority, byAuthority, byBelongSecond, belong } = convertAuthorityToPlainStructure(data.authority);
//             byClerks[data.uid] = { ...data, authority, belong };
//             byAuthorityTop = { ...byAuthorityTop, ...byAuthority };
//             byBelongTop = { ...byBelongTop, ...byBelongSecond };
//         }
//     }else{
//         data.forEach((item) => {
//             clerks.push(item.uid);
//             if (!byClerks[item.uid]) {
//                 const { authority, byAuthority, byBelongSecond, belong } = convertAuthorityToPlainStructure(item.authority);
//                 byClerks[item.uid] = { ...item, authority, belong };
//                 byAuthorityTop = { ...byAuthorityTop, ...byAuthority };
//                 byBelongTop = { ...byBelongTop, ...byBelongSecond };
//             }
//         });
//     }
//     return {
//         clerks,
//         byClerks,
//         byAuthorityTop,
//         byBelongTop
//     }
// };


const convertAuthorityToPlainStructure = (data) => {
    let authority = [];
    let byAuthority = {};
    let byBelongSecond = new Object();
    let belong = [];
    data.forEach((item) => {
        authority.push(item.uid);
        if (belong.indexOf(item.belong.uid) === -1) {
            belong.push(item.belong.uid);
        }
        if (!byAuthority[item.uid]) {
            const { belong, byBelong } = convertAuthorityBelongToPlainStructure(item.belong);
            byAuthority[item.uid] = { ...item, belong };
            byBelongSecond = { ...byBelongSecond, ...byBelong };
        }
    });
    return {
        authority,
        byAuthority,
        byBelongSecond,
        belong
    }
}

const convertAuthorityBelongToPlainStructure = (data) => {
    let belong = data.uid;
    let byBelong = {};
    if (!byBelong[data.uid]) {
        byBelong[data.uid] = data;
    }
    return {
        belong,
        byBelong
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_ALL_CLERKS:
            return {
                ...state,
                clerks: action.clerks,
                byClerks: action.byClerks,
                // byAuthority: action.byAuthority,
                // byBelong: action.byBelong
            };
        case types.FETCH_SHOP_CLERKS:
            return { ...state, byClerks: action.byClerks,clerks:action.clerks };
        ////////////////////////////////
        case types.ALTER_CLERK_POSITION:
            const { byClerks } = state;
            let newByClerks = { ...byClerks };
            action.clerks.forEach(id => {
                if (byClerks[id]) {
                    const item = { ...byClerks[id], position: "服务员" };
                    newByClerks = { ...newByClerks, [id]: item };
                    console.log("clerks:" + id, newByClerks)
                }
            });
            action.managers.forEach(id => {
                if (byClerks[id]) {
                    const item = { ...byClerks[id], position: "店长" };
                    newByClerks = { ...newByClerks, [id]: item };
                }
            });
            return { ...state, byClerks: newByClerks };
        case types.FETCH_ALL_AUTHORITY:
            return { ...state, allAuthority: action.allAuthority, allBelong: action.allBelong, byAuthority: action.byAuthority, byBelong: action.byBelong };
        case types.FETCH_ALL_POSITION:
            return { ...state, allPosition: action.allPosition, byAllPosition: action.byAllPosition };
        case types.ALTER_CLERK_INFO:
            const byClerks1 = { ...state.byClerks, [action.newClerkInfo.uid]: action.newClerkInfo };
            return { ...state, byClerks: byClerks1 };
        case types.DELETE_CLERK:
            let byClerks2 = new Object();
            for (var key in state.byClerks) {
                if (key !== action.id) {
                    byClerks2[key] = state.byClerks[key];
                }
            }
            return { ...state, byClerks: byClerks2, clerks: state.clerks.filter(item => item !== action.id) };
        case types.ADD_CLERK:
            return {
                ...state,
                clerks: action.clerks,
                byClerks: action.byClerks,
                byAuthority: action.byAuthority,
                byBelong: action.byBelong
            };
        default:
            return state;
    }
}

export default reducer;

export const getByClerks = (state) => state.clerk.byClerks;
export const getClerks = (state) => state.clerk.clerks;
/////////////////////////////////////
export const getByAuthority = (state) => state.clerk.byAuthority;
export const getByBelong = (state) => state.clerk.byBelong;
export const getAllBelong = (state) => state.clerk.allBelong;
export const getAllAuthority = (state) => state.clerk.allAuthority;
export const getAllPosition = (state) => state.clerk.allPosition;
export const getByAllPosition = (state) => state.clerk.byAllPosition;