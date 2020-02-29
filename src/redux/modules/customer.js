import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get } from "../../utils/request";
import { requestType } from "../../utils/common";

const initialState = {
    customerType: new Array(),
    byCustomerType: new Object(),
}

export const types = {
    FETCH_CUSTOMER_TYPE: "CUSTOMER/FETCH_CUSTOMER_TYPE", //get the type of the customer
};

export const actions = {
    fetchCustomerType: (reqType = requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            return get(url.fetchCustomerType()).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchCustomerTypeSuccess(convetCustomerTypeToPlainStructure(data.customerType)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject();
                }
            });
        }
    }
}

const convetCustomerTypeToPlainStructure = (data) => {
    let customerType = new Array();
    let byCustomerType = new Object();
    data.forEach((item) => {
        customerType.push(item.uid);
        if (!byCustomerType[item.uid]) {
            byCustomerType[item.uid] = item;
        }
    });
    return {
        customerType,
        byCustomerType,
    }
}

const fetchCustomerTypeSuccess = ({ customerType, byCustomerType }) => ({
    type: types.FETCH_CUSTOMER_TYPE,
    customerType,
    byCustomerType,
})

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_CUSTOMER_TYPE:
            return { ...state, customerType: action.customerType, byCustomerType: action.byCustomerType };
        default:
            return state;
    }
}

export default reducer;

export const getCustomerType = (state) => state.customer.customerType;
export const getByCustomerType = (state) => state.customer.byCustomerType;
