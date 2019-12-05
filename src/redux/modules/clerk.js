import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get } from "../../utils/request";

const initialState = {
    clerks: null,
    byClerks: null
};

export const types = {
    FETCH_ALL_CLERKS: "CLERK/FETCH_ALL_CLERKS",          //获取所有员工信息
    FETCH_SHOP_CLERKS: "CLERK/FETCH_SHOP_CLERKS",        //获取门店员工信息
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
}

const fetchAllClerksSuccess = ({ clerks, byClerks }) => ({
    type: types.FETCH_ALL_CLERKS,
    clerks,
    byClerks
})

const convertClerksToPlainStructure = (data) => {
    let clerks = [];
    let byClerks = {};
    data.forEach((item) => {
        clerks.push(item.id);
        if (!byClerks[item.id]) {
            byClerks[item.id] = item;
        }
    });
    return {
        clerks,
        byClerks
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_SHOP_CLERKS:
            return { ...state, byClerks: action.byClerks };
        case types.FETCH_ALL_CLERKS:
            return { ...state, clerks: action.clerks, byClerks: action.byClerks };
        default:
            return state;
    }
}

export default reducer;

export const getPlainClerks = (state) => state.clerk.byClerks;
export const getClerks = (state) => state.clerk.clerks;