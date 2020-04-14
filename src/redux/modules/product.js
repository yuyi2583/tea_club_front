import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get, post, put, _delete } from "../../utils/request";
import { requestType } from "../../utils/common";

const initialState = {
    productTypes: new Array(),//产品类型
    byProductTypes: new Object(),
    products: new Array(),
    byProducts: new Object(),
    byPhotos: new Object(),
    byActivities: new Object(),//产品适用活动
};

export const types = {
    FETCH_PRODUCT_TYPES: "PRODUCT/FETCH_PRODUCT_TYPES",
    FETCH_PRODUCTS_NAME_BY_TYPE: "PRODUCT/FETCH_PRODUCTS_NAME_BY_TYPE",
    ADD_PRODUCT_TYPE: "PRODUCT/ADD_PRODUCT_TYPE",
    ADD_PRODUCT: "PRODUCT/ADD_PRODUCT",
    FETCH_PRODUCTS: "PRODUCT/FETCH_PRODUCTS",
    TERMINAL_PRODUCT: "PRODUCT/TERMINAL_PRODUCT",//下架产品
    FETCH_PRODUCT: "PRODUCT/FETCH_PRODUCT",//获取产品详细信息
    UPDATE_PRODUCT: "PRODUCT/UPDATE_PRODUCT",
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
    //获取产品信息
    fetchProduct: (uid) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchProduct(uid)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchProductSuccess(convertProductToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //修改产品信息
    updateProduct: (product) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(requestType.updateRequest));
            const params = { ...product };
            return put(url.updateProduct(), params).then((result) => {
                dispatch(appActions.finishRequest(requestType.updateRequest));
                if (!result.error) {
                    dispatch(updateProductSuccess(convertUpdateProductToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
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
});

const convertProductToPlainStructure = (data) => {
    let photos = new Array();
    let byPhotos = new Object();
    let activities = new Array();
    let byActivities = new Object();
    data.photos.forEach(photo => {
        photos.push(photo.uid);
        if (!byPhotos[photo.uid]) {
            byPhotos[photo.uid] = photo;
        }
    });
    data.activities.forEach((activity => {
        activities.push(activity.uid);
        if (!byActivities[activity.uid]) {
            byActivities[activity.uid] = activity;
        }
    }));
    return {
        product: { ...data, photos, activities },
        byPhotos,
        byActivities
    }
}

const fetchProductSuccess = ({ product, byPhotos, byActivities }) => ({
    type: types.FETCH_PRODUCT,
    product,
    byPhotos,
    byActivities
});

const convertUpdateProductToPlainStructure = (data) => {
    let photos = new Array();
    let byPhotos = new Object();
    data.photos.forEach(photo => {
        photos.push(photo.uid);
        if (!byPhotos[photo.uid]) {
            byPhotos[photo.uid] = photo;
        }
    });
    return {
        product: { ...data, photos },
        byPhotos,
    }
}

const updateProductSuccess = ({ product, byPhotos, byActivities }) => ({
    type: types.UPDATE_PRODUCT,
    product,
    byPhotos,
    byActivities
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
        case types.UPDATE_PRODUCT:
            byProducts = { ...state.byProducts, [action.product.uid]: { ...action.product, activities: state.byProducts[action.product.uid].activities } }
            return { ...state, byProducts, byPhotos: action.byPhotos };
        case types.FETCH_PRODUCT:
            products=state.products;
            if(products.indexOf(action.product.uid)==-1){
                products.push(action.product.uid);
            }
            byProducts = { ...state.byProducts, [action.product.uid]: action.product };
            return { ...state, byProducts, byPhotos: action.byPhotos, byActivities: action.byActivities };
        default:
            return state;
    }
}

export default reducer;

export const getProductTypes = (state) => state.product.productTypes;
export const getByProductTypes = (state) => state.product.byProductTypes;
export const getByProducts = (state) => state.product.byProducts;
export const getProducts = (state) => state.product.products;
export const getByProductPhotos = (state) => state.product.byPhotos;
export const getByProductActivities = (state) => state.product.byActivities;