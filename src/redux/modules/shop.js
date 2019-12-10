import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get } from "../../utils/request";
import { actions as clerkActions } from "./clerk";
import { actions as uiActions } from "./ui";

const initialState = {
    shopList: new Array(),
    shopInfo: null,
    byBoxes: null,//包厢
    byDisplay: null,//门店图片
    byShopList: null,
}

export const types = {
    FETCH_SHOP_INFO: "SHOP/FETCH_SHOP_INFO",     //获取门店信息
    FETCH_SHOP_LIST: "SHOP/FETCH_SHOP_LIST",      //获取门店列表
    REMOVE_SHOP_CLERK: "SHOP/REMOVE_SHOP_CLERK",     //移除门店职员
    ADD_SHOP_CLERK: "SHOP/ADD_SHOP_CLERK",           //添加门店职员
    SET_DISPLAY: "SHOP/SET_DISPLAY",             //设置门店图片
    SET_BOX_INFO: "SHOP/SET_BOX_INFO",               //设置包厢信息
    DELETE_BOX_INFO: "SHOP/DELETE_BOX_INFO",         //删除包厢
    ADD_BOX_INFO: "SHOP/ADD_BOX_INFO",               //新增包厢
    ALTER_SHOP_INFO: "SHOP/ALTER_SHOP_INFO",         //修改门店信息
};

export const actions = {
    //获取门店信息
    fetchShopInfo: (shopId) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { shopId };
            return get(url.fetchShopInfo(), params).then((data) => {
                dispatch(appActions.finishRequest());
                if (!data.error) {
                    const { shopInfo, byClerks, byBoxes, byDisplay } = convertShopInfoToPlainStructure(data.shopInfo);
                    const a = {}
                    dispatch(fetchShopInfoSuccess(shopInfo, byBoxes, byDisplay));
                    // dispatch(actions.setDisplay(byDisplay));
                    dispatch(clerkActions.fetchClerks(byClerks))
                } else {
                    dispatch(appActions.setError(data.error));
                }
            })
        }
    },
    //获取门店列表
    fetchShopList: () => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchShopList()).then((data) => {
                dispatch(appActions.finishRequest());
                if (!data.error) {
                    dispatch(fetchShopListSuccess(convertShopListToPlainStructure(data.shopList)));
                } else {
                    dispatch(appActions.setError(data.error));
                }
            })
        }
    },
    //移除门店职员:
    removeShopClerk: (clerkId) => ({
        type: types.REMOVE_SHOP_CLERK,
        clerkId
    }),
    //添加门店职员
    addShopClerk: (clerks) => ({
        type: types.ADD_SHOP_CLERK,
        clerks
    }),
    setDisplay: (display) => ({
        type: types.SET_DISPLAY,
        display
    }),
    //修改包厢信息
    alterBoxInfo: (newBoxInfo) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { newBoxInfo };
            return get(url.alterBoxInfo(), params).then((data) => {
                dispatch(appActions.finishRequest());
                if (!data.error) {
                    dispatch(alterBoxInfoSuccess(newBoxInfo));
                } else {
                    dispatch(appActions.setError(data.error));
                }
                dispatch(uiActions.finishAlterInfo());
            })
        }
    },
    //删除包厢信息
    deleteBoxInfo: (shopId, boxId) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { shopId, boxId };
            return get(url.deleteBoxInfo(), params).then((data) => {
                dispatch(appActions.finishRequest());
                if (!data.error) {
                    dispatch(deleteBoxInfoSuccess(shopId, boxId));
                } else {
                    dispatch(appActions.setError(data.error));
                }
            })
        }
    },
    //新增包厢
    addBoxInfo: (newBoxInfo) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { newBoxInfo };
            return get(url.addBoxInfo(), params).then((data) => {
                dispatch(appActions.finishRequest());
                if (!data.error) {
                    dispatch(addBoxInfoSuccess(data.boxInfo));
                    return Promise.resolve({ result: true });
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.resolve({ result: false, error: "cuowu" });
                }
            })
        }
    },
    //修改门店信息
    alterShopInfo: ({ shopInfo, selectClerks, selectManagers }) => {
        return (dispatch) => {
            dispatch(appActions.startModalRequest());
            const params = { shopInfo, selectClerks, selectManagers };
            return get(url.alterShopInfo(), params).then((data) => {
                dispatch(appActions.finishModalRequest());
                if (!data.error) {
                    dispatch(alterShopInfoSuccess(shopInfo));
                    dispatch(clerkActions.alterClerkPosition(selectClerks, selectManagers));
                    dispatch(uiActions.finishAlterInfo());
                    return Promise.resolve(true);
                } else {
                    dispatch(appActions.setError(data.error));
                    dispatch(uiActions.finishAlterInfo());
                    return Promise.reject(data.error);
                }
            })
        }
    }
};

const alterBoxInfoSuccess = (newBoxInfo) => ({
    type: types.SET_BOX_INFO,
    newBoxInfo
});

const deleteBoxInfoSuccess = (shopId, boxId) => ({
    type: types.DELETE_BOX_INFO,
    shopId,
    boxId
})

const addBoxInfoSuccess = (newBoxInfo) => ({
    type: types.ADD_BOX_INFO,
    boxInfo: newBoxInfo
})

const alterShopInfoSuccess = (shopInfo) => ({
    type: types.ALTER_SHOP_INFO,
    shopInfo,
})

const convertShopInfoToPlainStructure = (shopInfo) => {
    let byClerk = [];
    let plainClerk = {};
    let byBoxes = [];
    let plainBoxes = {};
    let byDisplay = [];
    let plainDisplay = {}
    const { clerks, boxes, display } = shopInfo;
    const shopManager = clerks.filter((item) => item.position.indexOf("店长") != -1);
    shopManager.forEach((item) => {
        byClerk.push(item.id);
    })
    clerks.forEach((item) => {
        if (item.position.indexOf("店长") == -1) {
            byClerk.push(item.id);
        }
        if (!plainClerk[item.id]) {
            plainClerk[item.id] = item;
        }
    });
    boxes.forEach((item) => {
        byBoxes.push(item.id);
        if (!plainBoxes[item.id]) {
            plainBoxes[item.id] = item;
        }
    });
    display.forEach((item) => {
        byDisplay.push(item.uid);
        if (!plainDisplay[item.uid]) {
            plainDisplay[item.uid] = item;
        }
    })
    return {
        shopInfo: { ...shopInfo, clerks: byClerk, boxes: byBoxes, display: byDisplay },
        byClerks: plainClerk,
        byBoxes: plainBoxes,
        byDisplay: plainDisplay,
    }
}
const convertShopListToPlainStructure = (shopList) => {
    let byShopList = [];
    let plainShopList = {}
    shopList.forEach((item) => {
        byShopList.push(item.id);
        if (!plainShopList[item.id]) {
            plainShopList[item.id] = {
                ...item
            }
        }
    })
    return {
        shopList: byShopList,
        byShopList: plainShopList
    };
}

const fetchShopListSuccess = ({ shopList, byShopList }) => ({
    type: types.FETCH_SHOP_LIST,
    shopList,
    byShopList
});

const fetchShopInfoSuccess = (shopInfo, byBoxes, byDisplay) => ({
    type: types.FETCH_SHOP_INFO,
    shopInfo,
    byBoxes,
    byDisplay,
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_SHOP_INFO:
            return { ...state, shopInfo: action.shopInfo, byBoxes: action.byBoxes, byDisplay: action.byDisplay };
        case types.FETCH_SHOP_LIST:
            return { ...state, shopList: action.shopList, byShopList: action.byShopList };
        case types.ADD_SHOP_CLERK:
            const clerk = [...state.shopInfo.clerks, ...action.clerks];
            const shopInfo = { ...state.shopInfo, clerks: clerk };
            return { ...state, shopInfo };
        case types.REMOVE_SHOP_CLERK:
            const clerks = state.shopInfo.clerks.filter(id => id != action.clerkId);
            const newShopInfo = { ...state.shopInfo, clerks: clerks };
            return { ...state, shopInfo: newShopInfo };
        case types.SET_DISPLAY:
            const shopinfo = { ...state.shopInfo, display: action.display };
            return { ...state, shopInfo: shopinfo };
        case types.SET_BOX_INFO:
            const newByBoxes = { ...state.byBoxes, [action.newBoxInfo.id]: action.newBoxInfo };
            return { ...state, byBoxes: newByBoxes };
        case types.DELETE_BOX_INFO:
            const boxes = state.shopInfo.boxes.filter((boxId) => boxId != action.boxId);
            const newShopInfo1 = { ...state.shopInfo, boxes };
            let newByBoxes1 = new Object();
            for (var key in state.byBoxes) {
                if (state.byBoxes[key].id !== action.boxId && !newByBoxes1[key]) {
                    newByBoxes1[key] = state.byBoxes[key];
                }
            }
            return { ...state, shopInfo: newShopInfo1, byBoxes: newByBoxes1 };
        case types.ADD_BOX_INFO:
            const boxes1 = [...state.shopInfo.boxes, action.boxInfo.id];
            const newShopInfo2 = { ...state.shopInfo, boxes: boxes1 };
            const newByBoxes2 = { ...state.byBoxes, [action.boxInfo.id]: action.boxInfo };
            return { ...state, shopInfo: newShopInfo2, byBoxes: newByBoxes2 };
        case types.ALTER_SHOP_INFO:
            return { ...state, shopInfo: action.shopInfo };
        default:
            return state;
    }
}

export default reducer;

export const getShop = (state) => state.shop;
export const getShopList = (state) => state.shop.byShopList;
export const getBoxes = (state) => state.shop.byBoxes;
export const getDisplay = (state) => state.shop.byDisplay;