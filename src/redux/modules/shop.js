import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get, post, put, _delete } from "../../utils/request";
import { actions as clerkActions } from "./clerk";
import { actions as uiActions } from "./ui";

const initialState = {
    shops: new Array(),
    byShops: new Object(),
    // openHours:new Array(),
    byOpenHours: new Object(),//营业时间
    byPhotos: new Object(),//门店照片
    byClerks: new Object(),//门店职员
    shopBoxes: new Array(),
    byShopBoxes: new Object(),
    ////////////////////////////////
    shopList: new Array(),
    shopInfo: null,
    byBoxes: null,//包厢
    byDisplay: null,//门店图片
    byShopList: null,

}

export const types = {
    FETCH_SHOPS: "SHOP/FETCH_SHOPS",
    REMOVE_SHOP: "SHOP/REMOVE_SHOP",
    ADD_SHOP: "SHOP/ADD_SHOP",                       //新增门店
    FETCH_SHOP: "SHOP/FETCH_SHOP",     //获取门店信息
    //////////////////////////////////
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
    fetchShops: () => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchShops()).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchShopsSuccess(convertShopsToPlainStructure(result.data)));
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    removeShop: (uid) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return _delete(url.removeShop(uid)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(removeShopSuccess(uid));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //新增门店
    addShop: (shop) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { ...shop };
            return post(url.addShop(), params).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(addShopSuccess(result.data));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //获取门店信息
    fetchShop: (shopId) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchShop(shopId)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    const { shop, byOpenHours, byPhotos, byClerks, shopBoxes, byShopBoxes } = convertShopToPlainStructure(result.data);
                    dispatch(fetchShopSuccess(shop, byOpenHours, byPhotos, byClerks, shopBoxes, byShopBoxes));
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //新增包厢
    addBoxInfo: (shopBox) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { ...shopBox };
            return post(url.addBoxInfo(), params).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(addBoxInfoSuccess(result.data));//TODO update the addBoxInfoSuccess funaction it cannot read the result.data
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    /////////////////////////////////////////////////////////////////////
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
            return get(url.alterBoxInfo(), params).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(alterBoxInfoSuccess(result.data));
                } else {
                    dispatch(appActions.setError(result.error));
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
    //修改门店信息
    alterShopInfo: ({ shopInfo, selectClerks, selectManagers, byOpenHours }) => {
        return (dispatch) => {
            dispatch(appActions.startModalRequest());
            const params = { shopInfo, selectClerks, selectManagers, byOpenHours };
            return get(url.alterShopInfo(), params).then((data) => {
                dispatch(appActions.finishModalRequest());
                if (!data.error) {
                    dispatch(alterShopInfoSuccess(shopInfo, byOpenHours));
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
    },

};

const addShopSuccess = (shop) => ({
    type: types.ADD_SHOP,
    shop
})

const removeShopSuccess = (uid) => ({
    type: types.REMOVE_SHOP,
    uid
});

const fetchShopsSuccess = ({ shops, byShops }) => ({
    type: types.FETCH_SHOPS,
    shops,
    byShops
});

const fetchShopSuccess = (shop, byOpenHours, byPhotos, byClerks, shopBoxes, byShopBoxes) => ({
    type: types.FETCH_SHOP,
    shop,
    byOpenHours,
    byPhotos,
    byClerks,
    shopBoxes,
    byShopBoxes
});

const convertShopsToPlainStructure = (data) => {
    let shops = new Array();
    let byShops = new Object;
    data.forEach((item) => {
        shops.push(item.uid);
        if (!byShops[item.uid]) {
            byShops[item.uid] = item;
        }
    })
    return {
        shops,
        byShops
    };
}

const convertShopToPlainStructure = (data) => {
    let openHours = new Array();
    let byOpenHours = new Object();
    let photos = new Array();
    let byPhotos = new Object();
    let clerks = new Array();
    let byClerks = new Object();
    let shopBoxes = new Array();
    let byShopBoxes = new Object();
    data.openHours != null && data.openHours.forEach(openHour => {
        openHours.push(openHour.uid);
        if (!byOpenHours[openHour.uid]) {
            byOpenHours[openHour.uid] = openHour;
        }
    });
    data.photos != null && data.photos.forEach(photo => {
        photos.push(photo.uid);
        if (!byPhotos[photo.uid]) {
            byPhotos[photo.uid] = photo;
        }
    });
    data.clerks != null && data.clerks.forEach(clerk => {
        clerks.push(clerk.uid);
        if (!byClerks[clerk.uid]) {
            byClerks[clerk.uid] = clerk;
        }
    });
    data.shopBoxes != null && data.shopBoxes.forEach(shopBox => {
        shopBoxes.push(shopBox.uid);
        if (!byShopBoxes[shopBox.uid]) {
            byShopBoxes[shopBox.uid] = shopBox;
        }
    });
    return {
        shop: { ...data, openHours, photos, clerks, shopBoxes },
        byOpenHours,
        byPhotos,
        byClerks,
        shopBoxes,
        byShopBoxes,
    }
}
/////////////////////////////////////
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

const alterShopInfoSuccess = (shopInfo, byOpenHours) => ({
    type: types.ALTER_SHOP_INFO,
    shopInfo,
    byOpenHours
})

const convertShopInfoToPlainStructure = (shopInfo) => {
    let byClerk = [];
    let plainClerk = {};
    let byBoxes = [];
    let plainBoxes = {};
    let byDisplay = [];
    let plainDisplay = {}
    let byOpenHours = [];
    let plainOpenHours = {};
    const { clerks, boxes, display, openHours } = shopInfo;
    const shopManager = clerks.filter((item) => item.position.name.indexOf("店长") != -1);
    shopManager.forEach((item) => {
        byClerk.push(item.uid);
    })
    clerks.forEach((item) => {
        if (item.position.name.indexOf("店长") == -1) {
            byClerk.push(item.uid);
        }
        if (!plainClerk[item.uid]) {
            plainClerk[item.uid] = item;
        }
    });
    boxes.forEach((item) => {
        byBoxes.push(item.uid);
        if (!plainBoxes[item.uid]) {
            plainBoxes[item.uid] = item;
        }
    });
    display.forEach((item) => {
        byDisplay.push(item.uid);
        if (!plainDisplay[item.uid]) {
            plainDisplay[item.uid] = item;
        }
    })
    openHours.forEach((item) => {
        byOpenHours.push(item.uid);
        if (!plainOpenHours[item.uid]) {
            plainOpenHours[item.uid] = item;
        }
    })
    return {
        shopInfo: { ...shopInfo, clerks: byClerk, boxes: byBoxes, display: byDisplay, openHours: byOpenHours },
        byClerks: plainClerk,
        byBoxes: plainBoxes,
        byDisplay: plainDisplay,
        byOpenHours: plainOpenHours
    }
}


const reducer = (state = initialState, action) => {
    let shops;
    let byShops;
    switch (action.type) {
        case types.FETCH_SHOPS:
            return { ...state, shops: action.shops, byShops: action.byShops };
        case types.REMOVE_SHOP:
            shops = state.shops.filter(item => item != action.uid);
            byShops = new Object();
            shops.forEach(uid => {
                if (!byShops[uid]) {
                    byShops[uid] = state.byShops[uid];
                }
            })
            return { ...state, shops, byShops };
        case types.ADD_SHOP:
            if (state.shops.indexOf(action.shop.uid) == -1) {
                shops = state.shops.concat([action.shop.uid]);
            } else {
                shops = state.shops;
            }
            byShops = { ...state.byShops, [action.shop.uid]: action.shop };
            return { ...state, shops, byShops };
        case types.FETCH_SHOP:
            byShops = { ...state.byShops, [action.shop.uid]: action.shop };
            return {
                ...state, byOpenHours: action.byOpenHours, byShops, byPhotos: action.byPhotos,
                byClerks: action.byClerks, shopBoxes: action.shopBoxes, byShopBoxes: action.byShopBoxes
            };
        //////////////////////////////////////
        case types.FETCH_SHOP_INFO:
            return { ...state, shopInfo: action.shopInfo, byBoxes: action.byBoxes, byDisplay: action.byDisplay, byOpenHours: action.byOpenHours };
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
            const newByBoxes = { ...state.byBoxes, [action.newBoxInfo.uid]: action.newBoxInfo };
            return { ...state, byBoxes: newByBoxes };
        case types.DELETE_BOX_INFO:
            const boxes = state.shopInfo.boxes.filter((boxId) => boxId != action.boxId);
            const newShopInfo1 = { ...state.shopInfo, boxes };
            let newByBoxes1 = new Object();
            for (var key in state.byBoxes) {
                if (state.byBoxes[key].uid !== action.boxId && !newByBoxes1[key]) {
                    newByBoxes1[key] = state.byBoxes[key];
                }
            }
            return { ...state, shopInfo: newShopInfo1, byBoxes: newByBoxes1 };
        case types.ADD_BOX_INFO:
            const boxes1 = [...state.shopInfo.boxes, action.boxInfo.uid];
            const newShopInfo2 = { ...state.shopInfo, boxes: boxes1 };
            const newByBoxes2 = { ...state.byBoxes, [action.boxInfo.uid]: action.boxInfo };
            return { ...state, shopInfo: newShopInfo2, byBoxes: newByBoxes2 };
        case types.ALTER_SHOP_INFO:
            return { ...state, shopInfo: action.shopInfo, byOpenHours: action.byOpenHours };
        default:
            return state;
    }
}

export default reducer;

export const getShops = (state) => state.shop.shops;
export const getByShops = (state) => state.shop.byShops;
export const getByOpenHours = (state) => state.shop.byOpenHours;
export const getByPhotos = (state) => state.shop.byPhotos;
export const getByShopClerks = (state) => state.shop.byClerks;
export const getShopBoxes = (state) => state.shop.shopBoxes;
export const getByShopBoxes = (state) => state.shop.byShopBoxes;
//////////////////////////////////////////
export const getShop = (state) => state.shop;
export const getShopList = (state) => state.shop.byShopList;
export const getBoxes = (state) => state.shop.byBoxes;
export const getDisplay = (state) => state.shop.byDisplay;
export const getOpenHours = (state) => state.shop.byOpenHours;