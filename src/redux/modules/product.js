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
    CREATE_NEW_PRODUCT_TYPE: "PRODUCT/CREATE_NEW_PRODUCT_TYPE",//创建新的产品种类
    CREATE_NEW_PRODUCT: "PRODUCT/CREATE_NEW_PRODUCT",//新增产品
    TERMINAL_PRODUCT_SALE: "PRODUCT/TERMINAL_PRODUCT_SALE",//下架产品
    ALTER_PRODUCT_INFO: "PRODUCT/ALTER_PRODUCT_INFO"
};

export const actions = {
    fetchProductType: (reqType = requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            return get(url.fetchProductType()).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchProductTypeSuccess(types.FETCH_PRODUCT_TYPE, convertProductTypeToPlainStructure(data.productType)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject(data.error);
                }
            })
        }
    },
    //type=-1默认获取所有产品信息
    fetchProductDetail: (reqType = requestType.modalRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            return get(url.fetchProductDetailByType()).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchProductDetailSuccess(types.FETCH_PRODUCT_DETAIL, convertProductDetailToPlainStructure(data.productDetail)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject(data.error);
                }
            })
        }
    },
    createNewProductType: (newProductType, reqType = requestType.modalRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            const params = { productType: newProductType };
            return get(url.createNewProductType(), params).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchProductTypeSuccess(types.CREATE_NEW_PRODUCT_TYPE, convertProductTypeToPlainStructure(data.productType)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject(data.error);
                }
            })
        }
    },
    createNewProduct: (newProduct, reqType = requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            const params = { product: newProduct }
            return get(url.createNewProduct(), params).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchProductDetailSuccess(types.CREATE_NEW_PRODUCT, convertProductDetailToPlainStructure(data.productDetail)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject(data.error);
                }
            })
        }
    },
    terminalProductSale: (uid, reqType = requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            const params = { uid }
            return get(url.terminalProductSale(), params).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchProductDetailSuccess(types.TERMINAL_PRODUCT_SALE, convertProductDetailToPlainStructure(data.productDetail)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject(data.error);
                }
            })
        }
    },
    alterProductInfo: (product, reqType = requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            const params = { product }
            return get(url.alterProductInfo(), params).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchProductDetailSuccess(types.ALTER_PRODUCT_INFO, convertProductDetailToPlainStructure(data.productDetail)));
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

const fetchProductDetailSuccess = (type, { productDetail, byProductDetail }) => ({
    type,
    productDetail,
    byProductDetail
});

const fetchProductTypeSuccess = (type, { productType, byProductType }) => ({
    type,
    productType,
    byProductType,
});


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_PRODUCT_TYPE:
            return { ...state, productType: action.productType, byProductType: action.byProductType };
        case types.CREATE_NEW_PRODUCT:
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