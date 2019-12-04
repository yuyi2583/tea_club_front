import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get } from "../../utils/request";
import { actions as clerkActions } from "./clerk";

const initialState = {
    shopList: null,
    shopInfo: null,
    byBoxes: null,//包厢
    byDisplay: null,//门店图片
}

export const types = {
    FETCH_SHOP_INFO: "SHOP/FETCH_SHOP_INFO",     //获取门店信息
    FETCH_SHOP_LIST: "SHOP/FETCH_SHOP_LIST",      //获取门店列表
    REMOVE_SHOP_CLERK: "SHOP/REMOVE_SHOP_CLERK",     //移除门店职员
    ADD_SHOP_CLERK: "SHOP/ADD_SHOP_CLERK",           //添加门店职员
    SET_DISPLAY: "SHOP/SET_DISPLAY",             //设置门店图片
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
    addShopClerk: (clerkId) => ({
        type: types.ADD_SHOP_CLERK,
        clerkId
    }),
    setDisplay: (display) => ({
        type: types.SET_DISPLAY,
        display
    })
};

const convertShopInfoToPlainStructure = (shopInfo) => {
    let byClerk = [];
    let plainClerk = {};
    let byBoxes = [];
    let plainBoxes = {};
    let byDisplay = [];
    let plainDisplay = {}
    const { clerk, boxes, display } = shopInfo;
    const shopManager = clerk.filter((item) => item.position.indexOf("店长") != -1);
    shopManager.forEach((item) => {
        byClerk.push(item.id);
    })
    clerk.forEach((item) => {
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
        byDisplay.push(item.id);
        if (!plainDisplay[item.id]) {
            plainDisplay[item.id] = item;
            plainDisplay[item.id].uid = "-" + item.id;
        }
    })
    return {
        shopInfo: { ...shopInfo, clerk: byClerk, boxes: byBoxes, display: byDisplay },
        byClerks: plainClerk,
        byBoxes: plainBoxes,
        byDisplay: plainDisplay,
    }
}
const convertShopListToPlainStructure = (shopList) => {
    let byShopList = {};
    shopList.forEach((item) => {
        byShopList[item.id] = {
            ...item
        }
    })
    return byShopList;
}

const fetchShopListSuccess = (shopList) => ({
    type: types.FETCH_SHOP_LIST,
    shopList
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
            return { ...state, shopList: action.shopList };
        case types.ADD_SHOP_CLERK:
            let clerk = state.shopInfo.clerk;
            clerk.push(action.clerkId);
            const shopInfo = { ...state.shopInfo, clerk };
            return { ...state, shopInfo };
        case types.REMOVE_SHOP_CLERK:
            const clerks = state.shopInfo.clerk.filter(id => id != action.clerkId);
            const newShopInfo = { ...state.shopInfo, clerk: clerks };
            return { ...state, shopInfo: newShopInfo };
        case types.SET_DISPLAY:
            let byDisplay = {};
            action.display.forEach((displayId) => {
                if (!byDisplay[displayId]) {
                    byDisplay[displayId] = state.byDisplay[displayId];
                }
            });
            const shopinfo = { ...state.shopInfo, display: action.display };
            return { ...state, byDisplay, shopInfo: shopinfo };
        default:
            return state;
    }
}

export default reducer;

export const getShop = (state) => state.shop;
export const getShopList = (state) => {
    const { shopList } = state.shop;
    let byShopList = [];
    for (var key in shopList) {
        byShopList.push(shopList[key]);
    }
    return byShopList;
}
export const getBoxesInArray = (state) => {
    const { byBoxes } = state.shop;
    let boxesInArray = [];
    for (var key in byBoxes) {
        boxesInArray.push(byBoxes[key]);
    }
    return boxesInArray;
}
export const getDisplay = (state) => state.shop.byDisplay;