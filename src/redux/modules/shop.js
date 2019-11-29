import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get } from "../../utils/request";

const initialState = {
    shopList: {},
    shopInfo: {}
}

export const types = {
    FETCH_SHOP_INFO: "SHOP/FETCH_SHOP_INFO",     //获取门店信息
    FETCH_SHOP_LIST: "SHOP/FETCH_SHOP_LIST",      //获取门店列表
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
                    dispatch(fetchShopInfoSuccess(data.shopInfo));
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
    }
};

const convertShopListToPlainStructure=(shopList)=>{
    let byShopList={};
    shopList.forEach((item)=>{
        byShopList[item.id]={
            ...item
        }
    })
    return byShopList;
}

const fetchShopListSuccess = (shopList) => ({
    type: types.FETCH_SHOP_LIST,
    shopList
});

const fetchShopInfoSuccess = (shopInfo) => ({
    type: types.FETCH_SHOP_INFO,
    shopInfo
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_SHOP_INFO:
            return { ...state, shopInfo: action.shopInfo };
        case types.FETCH_SHOP_LIST:
            return { ...state, shopList: action.shopList };
        default:
            return state;
    }
}

export default reducer;

export const getShop = (state) => state.shop;
export const getShopList=(state)=>{
    const {shopList}=state.shop;
    let byShopList=[];
    for(var key in shopList){
        byShopList.push(shopList[key]);
    }
    return byShopList;
}