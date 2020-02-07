import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get } from "../../utils/request";
import { requestType } from "../../utils/common";

const initialState = {
    productType: new Array(),//产品类型
    byProductType: new Object(),
    productDetail: new Array(),
    byProductDetail: new Object(),
};

export const types = {
    FETCH_PRODUCT_TYPE: "PRODUCT/FETCH_PRODUCT_TYPE",
    FETCH_PRODUCT_DETAIL: "PRODUCT/FETCH_PRODUCT_DETAIL",//获取产品详细信息
};

export const actions = {
    fetchProductType: (reqType = requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            return get(url.fetchProductType()).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchProductTypeSuccess(convertProductTypeToPlainStructure(data.productType)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject(data.error);
                }
            })
        }
    },
    //type=-1默认获取所有产品信息
    fetchProductDetail: (type = -1, reqType = requestType.modalRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            return get(url.fetchProductDetailByType()).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchProductDetailSuccess(convertProductDetailToPlainStructure(data.productDetail)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject(data.error);
                }
            })
        }
    }
}
const convertProductDetailToPlainStructure = (data) => {
    console.log("product detail", data);
    let productDetail = new Array();
    let byProductDetail = new Object();
    data.forEach((item) => {
        productDetail.push(item.uid);
        if (!byProductDetail[item.uid]) {
            byProductDetail[item.uid] = item;
        }
    });
    return {
        productDetail,
        byProductDetail,
    };
};

const convertProductTypeToPlainStructure = (data) => {
    console.log("product type", data);
    let productType = new Array();
    let byProductType = new Object();
    data.forEach((item) => {
        productType.push(item.uid);
        if (!byProductType[item.uid]) {
            byProductType[item.uid] = item;
        }
    });
    return {
        productType,
        byProductType,
    }
};

const fetchProductDetailSuccess = ({ productDetail, byProductDetail }) => ({
    type: types.FETCH_PRODUCT_DETAIL,
    productDetail,
    byProductDetail
})

const fetchProductTypeSuccess = ({ productType, byProductType }) => ({
    type: types.FETCH_PRODUCT_TYPE,
    productType,
    byProductType,
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_PRODUCT_TYPE:
            return { ...state, productType: action.productType, byProductType: action.byProductType };
        case types.FETCH_PRODUCT_DETAIL:
            return { ...state, productDetail: action.productDetail, byProductDetail: action.byProductDetail };
        default:
            return state;
    }
}

export default reducer;

export const getProductType = (state) => state.product.productType;
export const getByProductType = (state) => state.product.byProductType;
export const getProductDetail = (state) => state.product.productDetail;
export const getByProductDetail = (state) => state.product.byProductDetail;