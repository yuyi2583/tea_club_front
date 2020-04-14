import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get, post, put, _delete } from "../../utils/request";
import { actions as clerkActions } from "./clerk";
import { requestType } from "../../utils/common";

const initialState = {
    shops: new Array(),
    byShops: new Object(),
    byOpenHours: new Object(),//营业时间
    byPhotos: new Object(),//门店照片
    shopBoxes: new Array(),
    byShopBoxes: new Object(),

}

export const types = {
    FETCH_SHOPS: "SHOP/FETCH_SHOPS",
    TERMINAL_SHOP: "SHOP/TERMINAL_SHOP",
    ADD_SHOP: "SHOP/ADD_SHOP",                       //新增门店
    FETCH_SHOP: "SHOP/FETCH_SHOP",     //获取门店信息
    ADD_SHOP_BOX: "SHOP/ADD_SHOP_BOX",               //新增包厢
    FETCH_SHOP_BOXES: "SHOP/FETCH_SHOP_BOXES",//获取包厢列表
    TERMINAL_SHOP_BOX: "SHOP/TERMINAL_SHOP_BOX",         //删除包厢
    FETCH_SHOP_BOX: "SHOP/FETCH_SHOP_BOX",//获取包厢信息
    UPDATE_SHOP_BOX: "SHOP/UPDATE_SHOP_BOX",//更新包厢信息
    UPDATE_SHOP: "SHOP/UPDATE_SHOP",         //修改门店信息
};

export const actions = {
    //获取门店列表
    fetchShops: () => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchShops()).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchShopsSuccess(convertShopsToPlainStructure(result.data)));
                } else {
                    dispatch(appActions.setError(result.error));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //将门店失效
    terminalShop: (uid) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return _delete(url.terminalShop(uid)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(terminalShopSuccess(uid));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.error));
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
                    dispatch(appActions.setError(result.error));
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
                    const { shop, byOpenHours, clerks, byPhotos, byClerks, shopBoxes, byShopBoxes } = convertShopToPlainStructure(result.data);
                    dispatch(clerkActions.fetchShopClerks(clerks, byClerks));
                    dispatch(fetchShopSuccess(shop, byOpenHours, byPhotos, shopBoxes, byShopBoxes));
                } else {
                    dispatch(appActions.setError(result.error));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //新增包厢
    addBox: (shopBox) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { ...shopBox };
            return post(url.addBox(), params).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(addShopBoxSuccess(result.data));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.error));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //获取包厢列表
    fetchShopBoxes: () => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchShopBoxes()).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchShopBoxesSuccess(convertShopBoxesToPlainStructure(result.data)));
                } else {
                    dispatch(appActions.setError(result.error));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //失效包厢
    terminalShopBox: (uid) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return _delete(url.removeShopBox(uid)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(terminalShopBoxSuccess(uid));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.error));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //获取包厢信息
    fetchShopBox: (uid) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchShopBox(uid)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchShopBoxSuccess(convertShopBoxToPlainStructure(result.data)));
                } else {
                    dispatch(appActions.setError(result.error));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //更新包厢信息
    updateShopBox: (shopBox) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(requestType.updateRequest));
            const params = { ...shopBox };
            return put(url.updateShopBox(), params).then((result) => {
                dispatch(appActions.finishRequest(requestType.updateRequest));
                if (!result.error) {
                    dispatch(updateShopBoxSuccess(convertShopBoxToPlainStructure(result.data)));
                } else {
                    dispatch(appActions.setError(result.error));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //更新门店信息
    updateShop: (shop) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(requestType.updateRequest));
            const params = { ...shop };
            return put(url.updateShop(), params).then((result) => {
                dispatch(appActions.finishRequest(requestType.updateRequest));
                if (!result.error) {
                    const { shop, byOpenHours, clerks, byPhotos, byClerks, shopBoxes, byShopBoxes } = convertShopToPlainStructure(result.data);
                    dispatch(clerkActions.fetchShopClerks(clerks, byClerks));
                    dispatch(updateShopSuccess(shop, byOpenHours, byPhotos, shopBoxes, byShopBoxes));
                } else {
                    dispatch(appActions.setError(result.error));
                    return Promise.reject(result.error);
                }
            })
        }
    },
};

const addShopSuccess = (shop) => ({
    type: types.ADD_SHOP,
    shop
})

const terminalShopSuccess = (uid) => ({
    type: types.TERMINAL_SHOP,
    uid
});

const terminalShopBoxSuccess = (uid) => ({
    type: types.TERMINAL_SHOP_BOX,
    uid,
})

const fetchShopsSuccess = ({ shops, byShops }) => ({
    type: types.FETCH_SHOPS,
    shops,
    byShops
});

const fetchShopSuccess = (shop, byOpenHours, byPhotos, shopBoxes, byShopBoxes) => ({
    type: types.FETCH_SHOP,
    shop,
    byOpenHours,
    byPhotos,
    shopBoxes,
    byShopBoxes
});

const updateShopSuccess = (shop, byOpenHours, byPhotos, shopBoxes, byShopBoxes) => ({
    type: types.UPDATE_SHOP,
    shop,
    byOpenHours,
    byPhotos,
    shopBoxes,
    byShopBoxes
});

const addShopBoxSuccess = (shopBox) => ({
    type: types.ADD_SHOP_BOX,
    shopBox
});

const fetchShopBoxesSuccess = ({ shopBoxes, byShopBoxes }) => ({
    type: types.FETCH_SHOP_BOXES,
    shopBoxes,
    byShopBoxes
});

const fetchShopBoxSuccess = ({ shopBox, byPhotos }) => ({
    type: types.FETCH_SHOP_BOX,
    shopBox,
    byPhotos
});

const updateShopBoxSuccess = ({ shopBox, byPhotos }) => ({
    type: types.UPDATE_SHOP_BOX,
    shopBox,
    byPhotos
});

const convertShopBoxesToPlainStructure = (data) => {
    let shopBoxes = new Array();
    let byShopBoxes = new Object();
    data.forEach((item) => {
        shopBoxes.push(item.uid);
        if (!byShopBoxes[item.uid]) {
            byShopBoxes[item.uid] = item;
        }
    })
    return {
        shopBoxes,
        byShopBoxes
    }
}

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
        clerks,
        byClerks,
        shopBoxes,
        byShopBoxes,
    }
}

const convertShopBoxToPlainStructure = (data) => {
    let byPhotos = new Object();
    let photos = new Array();
    data.photos.forEach(photo => {
        photos.push(photo.uid);
        if (!byPhotos[photo.uid]) {
            byPhotos[photo.uid] = photo;
        }
    });
    return {
        shopBox: { ...data, photos },
        byPhotos
    }

}

const reducer = (state = initialState, action) => {
    let shops;
    let byShops;
    let shopBoxes;
    let byShopBoxes;
    switch (action.type) {
        case types.FETCH_SHOPS:
            return { ...state, shops: action.shops, byShops: action.byShops };
        case types.TERMINAL_SHOP:
            byShops = { ...state.byShops, [action.uid]: { ...state.byShops[action.uid], enforceTerminal: true } };
            return { ...state, byShops };
        case types.ADD_SHOP:
            if (state.shops.indexOf(action.shop.uid) == -1) {
                shops = state.shops.concat([action.shop.uid]);
            } else {
                shops = state.shops;
            }
            byShops = { ...state.byShops, [action.shop.uid]: action.shop };
            return { ...state, shops, byShops };
        case types.FETCH_SHOP:
        case types.UPDATE_SHOP:
            byShops = { ...state.byShops, [action.shop.uid]: action.shop };
            return {
                ...state, byOpenHours: action.byOpenHours, byShops, byPhotos: action.byPhotos,
                shopBoxes: action.shopBoxes, byShopBoxes: action.byShopBoxes
            };
        case types.ADD_SHOP_BOX:
            shopBoxes = state.shopBoxes;
            if (shopBoxes.indexOf(action.shopBox.uid) == -1) {
                shopBoxes.push(action.shopBox.uid);
            }
            byShopBoxes = { ...state.byShopBoxes, [action.shopBox.uid]: action.shopBox };
            return { ...state, shopBoxes, byShopBoxes };
        case types.FETCH_SHOP_BOXES:
            return { ...state, shopBoxes: action.shopBoxes, byShopBoxes: action.byShopBoxes };
        case types.TERMINAL_SHOP_BOX:
            byShopBoxes = new Object();
            state.shopBoxes.forEach(uid => {
                if (!byShopBoxes[uid]) {
                    if (uid == action.uid) {
                        byShopBoxes[uid] = { ...state.byShopBoxes[uid], enforceTerminal: true };
                    } else {
                        byShopBoxes[uid] = state.byShopBoxes[uid];
                    }

                }
            });
            return { ...state, byShopBoxes };
        case types.FETCH_SHOP_BOX:
            shopBoxes = state.shopBoxes;
            if (state.shopBoxes.indexOf(action.shopBox.uid) == -1) {
                shopBoxes = state.shopBoxes.concat([action.shopBox.uid]);
            }
            byShopBoxes = { ...state.byShopBoxes, [action.shopBox.uid]: action.shopBox };
            return { ...state, shopBoxes, byPhotos: action.byPhotos, byShopBoxes };
        case types.UPDATE_SHOP_BOX:
            byShopBoxes = { ...state.byShopBoxes, [action.shopBox.uid]: action.shopBox };
            return { ...state, byPhotos: action.byPhotos, byShopBoxes };
        default:
            return state;
    }
}

export default reducer;

export const getShops = (state) => state.shop.shops;
export const getByShops = (state) => state.shop.byShops;
export const getByOpenHours = (state) => state.shop.byOpenHours;
export const getByPhotos = (state) => state.shop.byPhotos;
export const getShopBoxes = (state) => state.shop.shopBoxes;
export const getByShopBoxes = (state) => state.shop.byShopBoxes;