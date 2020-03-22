import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get, post, put, _delete } from "../../utils/request";
import { requestType } from "../../utils/common";

const initialState = {
    clerks: new Array(),
    byClerks: new Object(),
    positions: new Array(),
    byPositions: new Object(),
};

export const types = {
    FETCH_CLERKS: "CLERK/FETCH_CLERKS",          //获取所有员工信息
    FETCH_SHOP_CLERKS: "CLERK/FETCH_SHOP_CLERKS",        //获取门店员工信息
    FETCH_POSITIONS: "CLERK/FETCH_POSITIONS",          //获取所有职位信息
    REMOVE_CLERK: "CLERK/REMOVE_CLERK",                      //删除职员
    FETCH_CLERK: "CLERK/FETCH_CLERK",
    UPDATE_CLERK: "CLERK/UPDATE_CLERK",
}

export const actions = {
    //获取所有员工数据
    fetchClerks: (reqType = requestType.retrieveRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            return get(url.fetchClerks()).then((result) => {
                dispatch(appActions.finishRequest(reqType));
                if (!result.error) {
                    dispatch(fetchClerksSuccess(convertClerksToPlainStructure(result.data)));
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
    //获取所有职位信息
    fetchPositions: () => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchPositions()).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchPositionsSuccess(convertPositionsToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //添加职员
    addClerk: (clerk) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { ...clerk };
            return post(url.addClerk(), params).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(addClerkSuccess(result.data));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //删除职员
    removeClerk: (uid) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return _delete(url.removeClerk(uid)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(removeClerkSuccess(uid));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    fetchClerk: (uid) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchClerk(uid)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchClerkSuccess(result.data));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    updateClerk: (clerk) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(requestType.updateRequest));
            const params = { ...clerk };
            return put(url.updateClerk(), params).then((result) => {
                dispatch(appActions.finishRequest(requestType.updateRequest));
                if (!result.error) {
                    dispatch(updateClerkSuccess(result.data));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
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

const convertPositionsToPlainStructure = (data) => {
    let positions = new Array();
    let byPositions = new Object();
    data.forEach(position => {
        positions.push(position.uid);
        if (!byPositions[position.uid]) {
            byPositions[position.uid] = position;
        }
    });
    return {
        positions,
        byPositions,
    }
}

const fetchClerkSuccess = (data) => ({
    type: types.FETCH_CLERK,
    clerk: data
})

const updateClerkSuccess = (data) => ({
    type: types.UPDATE_CLERK,
    clerk: data
})

const addClerkSuccess = (data) => ({
    type: types.ADD_CLERK,
    clerk: data
})

const fetchPositionsSuccess = ({ positions, byPositions }) => ({
    type: types.FETCH_POSITIONS,
    positions,
    byPositions
})

const fetchClerksSuccess = ({ clerks, byClerks }) => ({
    type: types.FETCH_CLERKS,
    clerks,
    byClerks
})

const removeClerkSuccess = (uid) => ({
    type: types.REMOVE_CLERK,
    uid
})

const reducer = (state = initialState, action) => {
    let clerks;
    let byClerks;
    switch (action.type) {
        case types.FETCH_CLERKS:
            return {
                ...state,
                clerks: action.clerks,
                byClerks: action.byClerks,
            };
        case types.FETCH_SHOP_CLERKS:
            return { ...state, byClerks: action.byClerks, clerks: action.clerks };
        case types.FETCH_POSITIONS:
            return { ...state, positions: action.positions, byPositions: action.byPositions }
        case types.ADD_CLERK:
        case types.FETCH_CLERK:
        case types.UPDATE_CLERK:
            clerks = state.clerks;
            if (clerks.indexOf(action.clerk.uid) == -1) {
                clerks.push(action.clerk.uid);
            }
            byClerks = { ...state.byClerks, [action.clerk.uid]: action.clerk };
            return { ...state, clerks, byClerks };
        case types.REMOVE_CLERK:
            clerks = state.clerks.filter(uid => uid != action.uid);
            return { ...state, clerks };
        default:
            return state;
    }
}

export default reducer;

export const getByClerks = (state) => state.clerk.byClerks;
export const getClerks = (state) => state.clerk.clerks;
export const getPositions = (state) => state.clerk.positions;
export const getByPositions = (state) => state.clerk.byPositions;