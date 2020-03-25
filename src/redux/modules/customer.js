import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get } from "../../utils/request";
import { requestType } from "../../utils/common";

const initialState = {
    customerTypes: new Array(),
    byCustomerTypes: new Object(),
    ///////////////////////////////////////
    enterpriseCustomerApplication: new Array(),
    byEnterpriseCustomerApplication: new Object(),
    customers: new Array(),
    byCustomers: new Object(),
}

export const types = {
    FETCH_CUSTOMER_TYPES: "CUSTOMER/FETCH_CUSTOMER_TYPES", //get the type of the customer
    ////////////////////////////////////
    FETCH_ENTERPRISE_CUSTOMER_APPLICATION: "CUSTOMER/FETCH_ENTERPRISE_CUSTOMER_APPLICATION",
    START_APPLICATION_CHECK: "CUSTOMER/START_APPLICATION_CHECK",
    ADMIT_APPLICATION: "CUSTOMER/ADMIT_APPLICATION",
    REJECT_APPLICATION: "CUSTOMER/REJECT_APPLICATION",
    FETCH_ALL_CUSTOMERS: "CUSTOMER/FETCH_ALL_CUSTOMERS",
    SET_SUPER_VIP: "CUSTOMER/SET_SUPER_VIP",
    FETCH_CUSTOMER_BY_ID: "CUSTOMER/FETCH_CUSTOMER_BY_ID",
};

export const actions = {
    //获取用户类型
    fetchCustomerTypes: (reqType = requestType.retrieveRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            return get(url.fetchCustomerTypes()).then((result) => {
                dispatch(appActions.finishRequest(reqType));
                if (!result.error) {
                    dispatch(fetchCustomersTypeSuccess(convetCustomerTypesToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    ///////////////////////
    fetchEnterpriseCustomerApplication: (isFetchAll = false, reqType = requestType.retrieveRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            const params = { isFetchAll };
            return get(url.fetchEnterpriseCustomerApplication(), params).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchEnterpriseCustomerApplicationSuccess(types.FETCH_ENTERPRISE_CUSTOMER_APPLICATION, convertEnterpriseCustomerApplicationToPlainStructure(data.enterpriseCustomerApplication)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject();
                }
            });
        }
    },
    startApplicationCheck: (uid, reqType = requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            const params = { uid };
            return get(url.startApplicationCheck(), params).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchEnterpriseCustomerApplicationSuccess(types.START_APPLICATION_CHECK, convertEnterpriseCustomerApplicationToPlainStructure(data.enterpriseCustomerApplication)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject();
                }
            });
        }
    },
    admitApplication: (uid, reqType = requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            const params = { uid };
            return get(url.admitApplication(), params).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchEnterpriseCustomerApplicationSuccess(types.ADMIT_APPLICATION, convertEnterpriseCustomerApplicationToPlainStructure(data.enterpriseCustomerApplication)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject();
                }
            });
        }
    },
    rejectApplication: (uid, reqType = requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            const params = { uid };
            return get(url.rejectApplication(), params).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchEnterpriseCustomerApplicationSuccess(types.REJECT_APPLICATION, convertEnterpriseCustomerApplicationToPlainStructure(data.enterpriseCustomerApplication)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject();
                }
            });
        }
    },
    fetchAllCustomers: (reqType = requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            return get(url.fetchAllCustomers()).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchCustomersSuccess(types.FETCH_ALL_CUSTOMERS, convetCustomersToPlainStructure(data.customers)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject();
                }
            });
        }
    },
    setSuperVIP: (uid, reqType = requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            const params = { uid };
            return get(url.setSuperVIP(), params).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchCustomersSuccess(types.SET_SUPER_VIP, convetCustomersToPlainStructure(data.customers)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject();
                }
            });
        }
    },
    fetchCustomerById: (uid, reqType = requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            const params = { uid };
            return get(url.fetchCustomerById(), params).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchCustomerByIdSuccess(data.customer));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject();
                }
            });
        }
    },
}

const convetCustomerTypesToPlainStructure = (data) => {
    let customerTypes = new Array();
    let byCustomerTypes = new Object();
    data.forEach((item) => {
        customerTypes.push(item.uid);
        if (!byCustomerTypes[item.uid]) {
            byCustomerTypes[item.uid] = item;
        }
    });
    return {
        customerTypes,
        byCustomerTypes,
    }
}

const fetchCustomersTypeSuccess = ({ customerTypes, byCustomerTypes }) => ({
    type: types.FETCH_CUSTOMER_TYPES,
    customerTypes,
    byCustomerTypes,
});
//////////////////////////////////////////////////
const convetCustomersToPlainStructure = (data) => {
    let customers = new Array();
    let byCustomers = new Object();
    data.forEach((item) => {
        customers.push(item.uid);
        if (!byCustomers[item.uid]) {
            byCustomers[item.uid] = item;
        }
    });
    return {
        customers,
        byCustomers,
    }
}

const convertEnterpriseCustomerApplicationToPlainStructure = (data) => {
    let enterpriseCustomerApplication = new Array();
    let byEnterpriseCustomerApplication = new Object();
    data.forEach((item) => {
        enterpriseCustomerApplication.push(item.uid);
        if (!byEnterpriseCustomerApplication[item.uid]) {
            byEnterpriseCustomerApplication[item.uid] = item;
        }
    });
    return {
        enterpriseCustomerApplication,
        byEnterpriseCustomerApplication,
    }
}

const fetchCustomerByIdSuccess = (customer) => ({
    type: types.FETCH_CUSTOMER_BY_ID,
    customer
})

const fetchEnterpriseCustomerApplicationSuccess = (type, { enterpriseCustomerApplication, byEnterpriseCustomerApplication }) => ({
    type,
    enterpriseCustomerApplication,
    byEnterpriseCustomerApplication
})



const fetchCustomersSuccess = (type, { customers, byCustomers }) => ({
    type,
    customers,
    byCustomers,
})

const reducer = (state = initialState, action) => {
    let customers, byCustomers;
    switch (action.type) {
        case types.FETCH_CUSTOMER_TYPES:
            return { ...state, customerTypes: action.customerTypes, byCustomerTypes: action.byCustomerTypes };
        //////////////////////////////////////
        case types.START_APPLICATION_CHECK:
        case types.ADMIT_APPLICATION:
        case types.REJECT_APPLICATION:
        case types.FETCH_ENTERPRISE_CUSTOMER_APPLICATION:
            return { ...state, enterpriseCustomerApplication: action.enterpriseCustomerApplication, byEnterpriseCustomerApplication: action.byEnterpriseCustomerApplication };
        case types.FETCH_ALL_CUSTOMERS:
            return { ...state, customers: action.customers, byCustomers: action.byCustomers };
        case types.FETCH_CUSTOMER_BY_ID:
            customers = state.customers;
            byCustomers = { ...state.byCustomers, [action.customer.uid]: action.customer };
            if (state.customers.indexOf(action.customer.uid) == -1) {
                customers.push(action.customer.uid);
            }
            return { ...state, customers, byCustomers };
        default:
            return state;
    }
}

export default reducer;

export const getCustomerTypes = (state) => state.customer.customerTypes;
export const getByCustomerTypes = (state) => state.customer.byCustomerTypes;
///////////////////////////////////////////
export const getEnterpriseCustomerApplication = (state) => state.customer.enterpriseCustomerApplication;
export const getByEnterpriseCustomerApplication = (state) => state.customer.byEnterpriseCustomerApplication;
export const getCustomers = (state) => state.customer.customers;
export const getByCustomers = (state) => state.customer.byCustomers;
