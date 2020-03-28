import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get, post, put, _delete } from "../../utils/request";
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
    ADD_PRODUCT_TYPE: "PRODUCT/ADD_PRODUCT_TYPE",
    ADD_PRODUCT: "PRODUCT/ADD_PRODUCT",
    FETCH_PRODUCTS: "PRODUCT/FETCH_PRODUCTS",
    TERMINAL_PRODUCT: "PRODUCT/TERMINAL_PRODUCT",//下架产品
    /////////////////////////////////
    FETCH_PRODUCT_DETAIL: "PRODUCT/FETCH_PRODUCT_DETAIL",//获取产品详细信息
    // CREATE_NEW_PRODUCT_TYPE: "PRODUCT/CREATE_NEW_PRODUCT_TYPE",//创建新的产品种类
    // CREATE_NEW_PRODUCT: "PRODUCT/CREATE_NEW_PRODUCT",//新增产品
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
    //创建新的产品种类
    addProductType: (productType) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(requestType.modalRequest));
            const params = { name: productType };
            return post(url.addProductType(), params).then((result) => {
                dispatch(appActions.finishRequest(requestType.modalRequest));
                if (!result.error) {
                    dispatch(addProductTypeSuccess(result.data));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //新增产品
    addProduct: (product) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { ...product }
            return post(url.addProduct(), params).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(addProductSuccess());
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //获取产品列表
    fetchProducts: () => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchProducts()).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchProductsSuccess(convertProductsToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //下架商品
    terminalProduct: (uid) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return _delete(url.terminalProduct(uid)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(termianlProductSuccess(uid));
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

const addProductTypeSuccess = (productType) => ({
    type: types.ADD_PRODUCT_TYPE,
    productType
});

const addProductSuccess = () => ({
    type: types.ADD_PRODUCT
});

const convertProductsToPlainStructure = (data) => {
    let products = new Array();
    let byProducts = new Object();
    data.forEach(product => {
        products.push(product.uid);
        if (!byProducts[product.uid]) {
            byProducts[product.uid] = product;
        }
    });
    return {
        products,
        byProducts
    }
}

const fetchProductsSuccess = ({ products, byProducts }) => ({
    type: types.FETCH_PRODUCTS,
    products,
    byProducts
})

const termianlProductSuccess = (uid) => ({
    type: types.TERMINAL_PRODUCT,
    uid
})
/////////////////////////////////discard below
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
    let productTypes;
    let byProductTypes;
    let products;
    let byProducts;
    switch (action.type) {
        case types.FETCH_PRODUCT_TYPES:
            return { ...state, productTypes: action.productTypes, byProductTypes: action.byProductTypes };
        case types.FETCH_PRODUCTS_NAME_BY_TYPE:
            return { ...state, products: action.products, byProducts: action.byProducts };
        case types.ADD_PRODUCT_TYPE:
            productTypes = state.productTypes.concat([action.productType.uid]);
            byProductTypes = { ...state.byProductTypes, [action.productType.uid]: action.productType };
            return { ...state, productTypes, byProductTypes };
        case types.FETCH_PRODUCTS:
            return { ...state, products: action.products, byProducts: action.byProducts };
        case types.TERMINAL_PRODUCT:
            byProducts = { ...state.byProducts, [action.uid]: { ...state.byProducts[action.uid], enforceTerminal: true } };
            return { ...state, byProducts };
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