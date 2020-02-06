import { actions as appActions } from "./app";
import url from "../../utils/url";
import {get} from "../../utils/request";
import {requestType} from "../../utils/common";

const initialState = {
    productType: new Array(),//产品类型
    byProductType: new Object(),
};

export const types = {
    FETCH_PRODUCT_TYPE: "PRODUCT/FETCH_PRODUCT_TYPE",
};

export const actions = {
    fetchProductType: (reqType=requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            return get(url.fetchProductType()).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchProductTypeSuccess(convertProductTypeToPlainStructure(data.productType)));
                    return Promise.resolve();
                } else {
                    dispatch(actions.setError(data.error));
                    return Promise.reject(data.error);
                }
            })
        }
    }
}

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
}

const fetchProductTypeSuccess = ({ productType, byProductType }) => ({
    type: types.FETCH_PRODUCT_TYPE,
    productType,
    byProductType,
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_PRODUCT_TYPE:
            return { ...state, productType: action.productType, byProductType: action.byProductType };
        default:
            return state;
    }
}

export default reducer;

export const getProductType=(state)=>state.product.productType;
export const getByProductType=(state)=>state.product.byProductType;