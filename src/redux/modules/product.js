import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get } from "../../utils/request";
import { requestType } from "../../utils/common";

const initialState = {
    productTypes: new Array(),//产品类型
    byProductTypes: new Object(),
    products: new Array(),
    byProducts: new Object(),
    ///////////////////////////////
    productDetail: new Array(),
    byProductDetail: new Object(),
};

export const types = {
    FETCH_PRODUCT_TYPES: "PRODUCT/FETCH_PRODUCT_TYPES",
    FETCH_PRODUCTS_NAME_BY_TYPE: "PRODUCT/FETCH_PRODUCTS_NAME_BY_TYPE",
    /////////////////////////////////
    FETCH_PRODUCT_DETAIL: "PRODUCT/FETCH_PRODUCT_DETAIL",//获取产品详细信息
    CREATE_NEW_PRODUCT_TYPE: "PRODUCT/CREATE_NEW_PRODUCT_TYPE",//创建新的产品种类
    CREATE_NEW_PRODUCT: "PRODUCT/CREATE_NEW_PRODUCT",//新增产品
    TERMINAL_PRODUCT_SALE: "PRODUCT/TERMINAL_PRODUCT_SALE",//下架产品
    ALTER_PRODUCT_INFO: "PRODUCT/ALTER_PRODUCT_INFO"
};

export const actions = {
    //获取产品类型
    fetchProductTypes: (reqType = requestType.retrieveRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            return get(url.fetchProductTypes()).then((result) => {
                dispatch(appActions.finishRequest(reqType));
                if (!result.error) {
                    dispatch(fetchProductTypesSuccess(convertProductTypesToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //获取所有产品的名称
    fetchProductsName: () => {
        return (dispatch) => {
            dispatch(appActions.startRequest(requestType.modalRequest));
            return get(url.fetchProductsName()).then((result) => {//todo
                dispatch(appActions.finishRequest(requestType.modalRequest));
                if (!result.error) {
                    dispatch(fetchProductsNameByTypeSuccess(convertProductsNameByTypesToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    ///////////////////////////////////////
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

//converter

const convertProductTypesToPlainStructure = (data) => {
    console.log("product type", data);
    let productTypes = new Array();
    let byProductTypes = new Object();
    data.forEach((item) => {
        productTypes.push(item.uid);
        if (!byProductTypes[item.uid]) {
            byProductTypes[item.uid] = item;
        }
    });
    return {
        productTypes,
        byProductTypes,
    }
};

const fetchProductTypesSuccess = ({ productTypes, byProductTypes }) => ({
    type: types.FETCH_PRODUCT_TYPES,
    productTypes,
    byProductTypes,
});

const convertProductsNameByTypesToPlainStructure = (data) => {
    let products = new Array();
    let byProducts = new Object();
    data.forEach(item => {
        products.push(item.uid);
        if (!byProducts[item.uid]) {
            byProducts[item.uid] = item;
        }
    });
    return {
        products,
        byProducts
    }
}

const fetchProductsNameByTypeSuccess = ({ products, byProducts }) => ({
    type: types.FETCH_PRODUCTS_NAME_BY_TYPE,
    products,
    byProducts
})

/////////////////////////////////
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
        case types.FETCH_PRODUCT_TYPES:
            return { ...state, productTypes: action.productTypes, byProductTypes: action.byProductTypes };
        case types.FETCH_PRODUCTS_NAME_BY_TYPE:
            return { ...state, products: action.products, byProducts: action.byProducts };
        ////////////////////////////// 
        case types.CREATE_NEW_PRODUCT:
        case types.FETCH_PRODUCT_DETAIL:
            return { ...state, productDetail: action.productDetail, byProductDetail: action.byProductDetail };
        default:
            return state;
    }
}

export default reducer;

export const getProductTypes = (state) => state.product.productTypes;
export const getByProductTypes = (state) => state.product.byProductTypes;
export const getByProducts = (state) => state.product.byProducts;
export const getProducts = (state) => state.product.products;
///////////////////////////////
export const getProductDetail = (state) => state.product.productDetail;
export const getByProductDetail = (state) => state.product.byProductDetail;