import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get } from "../../utils/request";
import {actions as clerkActions} from "./clerk";

const initialState = {
    shopList: null,
    shopInfo: null
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
                    const {shopInfo,byClerks}=convertShopInfoToPlainStructure(data.shopInfo);
                    dispatch(fetchShopInfoSuccess(shopInfo));
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
    }
};
const convertShopInfoToPlainStructure=(shopInfo)=>{
    let byClerk=[];
    let plainClerk={};
    const {clerk}=shopInfo;
    const shopManager=clerk.filter((item)=>item.position.indexOf("店长")!=-1);
    shopManager.forEach((item)=>{
        byClerk.push(item.id);
    })
    clerk.forEach((item)=>{
        if(item.position.indexOf("店长")==-1){
            byClerk.push(item.id);
        }
        if(!plainClerk[item.id]){
            plainClerk[item.id]=item;
        }
    })
    return {
        shopInfo:{...shopInfo,clerk:byClerk},
        byClerks:plainClerk
    }
}
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