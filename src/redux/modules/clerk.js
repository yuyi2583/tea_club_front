import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get } from "../../utils/request";

const initialState = {
    clerks: null,
    byClerks: null,
    byAuthority: null,
    byBelong: null,
    allAuthority: null,
    allBelong: null,
};

export const types = {
    FETCH_ALL_CLERKS: "CLERK/FETCH_ALL_CLERKS",          //获取所有员工信息
    FETCH_SHOP_CLERKS: "CLERK/FETCH_SHOP_CLERKS",        //获取门店员工信息
    ALTER_CLERK_POSITION: "CLERK/ALTER_CLERK_POSITION",      //修改员工职位信息
    FETCH_ALL_AUTHORITY: "CLERK/FETCH_ALL_AUTHORITY",        //获取所有权限信息
}

export const actions = {
    //获取所有员工数据
    fetchAllClerks: () => {
        return (dispatch) => {
            return get(url.fetchAllClerks()).then((data) => {
                dispatch(appActions.finishRequest());
                dispatch(appActions.finishModalRequest());
                if (!data.error) {
                    dispatch(fetchAllClerksSuccess(convertClerksToPlainStructure(data.clerks)));
                } else {
                    dispatch(actions.setError(data.error));
                }
            })
        }
    },
    fetchClerks: (byClerks) => ({
        type: types.FETCH_SHOP_CLERKS,
        byClerks
    }),
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
    }
}

const fetchAllAuthoritySuccess = ({ authority, byAuthority, byBelongSecond, belong }) => ({
    type: types.FETCH_ALL_AUTHORITY,
    allAuthority: authority,
    byAuthority,
    byBelong: byBelongSecond,
    allBelong: belong
})

const fetchAllClerksSuccess = ({ clerks, byClerks, byAuthorityTop, byBelongTop }) => ({
    type: types.FETCH_ALL_CLERKS,
    clerks,
    byClerks,
    byAuthority: byAuthorityTop,
    byBelong: byBelongTop,
})

const convertClerksToPlainStructure = (data) => {
    let clerks = [];
    let byClerks = {};
    let byAuthorityTop = new Object();
    let byBelongTop = new Object();
    data.forEach((item) => {
        clerks.push(item.id);
        if (!byClerks[item.id]) {
            const { authority, byAuthority, byBelongSecond, belong } = convertAuthorityToPlainStructure(item.authority);
            byClerks[item.id] = { ...item, authority, belong };
            byAuthorityTop = { ...byAuthorityTop, ...byAuthority };
            byBelongTop = { ...byBelongTop, ...byBelongSecond };
        }
    });
    return {
        clerks,
        byClerks,
        byAuthorityTop,
        byBelongTop
    }
};

const convertAuthorityToPlainStructure = (data) => {
    let authority = [];
    let byAuthority = {};
    let byBelongSecond = new Object();
    let belong = [];
    data.forEach((item) => {
        authority.push(item.id);
        if (belong.indexOf(item.belong.id) === -1) {
            belong.push(item.belong.id);
        }
        if (!byAuthority[item.id]) {
            const { belong, byBelong } = convertAuthorityBelongToPlainStructure(item.belong);
            byAuthority[item.id] = { ...item, belong };
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
    let belong = data.id;
    let byBelong = {};
    if (!byBelong[data.id]) {
        byBelong[data.id] = data;
    }
    return {
        belong,
        byBelong
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_SHOP_CLERKS:
            return { ...state, byClerks: action.byClerks };
        case types.FETCH_ALL_CLERKS:
            return {
                ...state,
                clerks: action.clerks,
                byClerks: action.byClerks,
                byAuthority: action.byAuthority,
                byBelong: action.byBelong
            };
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
        default:
            return state;
    }
}

export default reducer;

export const getByClerks = (state) => state.clerk.byClerks;
export const getClerks = (state) => state.clerk.clerks;
export const getByAuthority = (state) => state.clerk.byAuthority;
export const getByBelong = (state) => state.clerk.byBelong;