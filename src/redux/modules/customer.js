import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get } from "../../utils/request";
import { requestType } from "../../utils/common";

const initialState = {
    customerTypes: new Array(),
    byCustomerTypes: new Object(),
    enterpriseCustomerApplications: new Array(),
    byEnterpriseCustomerApplications: new Object(),
    byEnterpriseBusinessLicense: new Object(),
    byCustomerAvatar: new Object(),
    ///////////////////////////////////////
    customers: new Array(),
    byCustomers: new Object(),
}

export const types = {
    FETCH_CUSTOMER_TYPES: "CUSTOMER/FETCH_CUSTOMER_TYPES", //get the type of the customer
    FETCH_ENTERPRISE_CUSTOMER_APPLICATIONS: "CUSTOMER/FETCH_ENTERPRISE_CUSTOMER_APPLICATIONS",
    START_APPLICATION_CHECK: "CUSTOMER/START_APPLICATION_CHECK",
    FETCH_ENTERPRISE_CUSTOMER_APPLICATION: "CUSTOMER/FETCH_ENTERPRISE_CUSTOMER_APPLICATION",
    APPROVE_APPLICATION: "CUSTOMER/APPROVE_APPLICATION",
    REJECT_APPLICATION: "CUSTOMER/REJECT_APPLICATION",
    ////////////////////////////////////
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
    //获取企业用户申请
    //isFetchALL==true 获取所有的申请
    //isFetchALL==false 获取近三月的申请
    fetchEnterpriseCustomerApplication: (isFetchAll = false, reqType = requestType.retrieveRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            return get(url.fetchEnterpriseCustomerApplication(isFetchAll)).then((result) => {
                dispatch(appActions.finishRequest(reqType));
                if (!result.error) {
                    dispatch(fetchEnterpriseCustomerApplicationsSuccess(convertEnterpriseCustomerApplicationsToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //开始审核企业用户申请
    startApplicationCheck: (uid) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.startApplicationCheck(uid)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(startApplicationCheckSuccess(uid));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //获取企业用户申请详细信息
    fetchApplication: (uid) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchApplication(uid)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchApplicationSuccess(convertEnterpriseCustomerApplicationToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //通过申请
    approveApplication: (uid) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(requestType.updateRequest));
            return get(url.approveApplication(uid)).then((result) => {
                dispatch(appActions.finishRequest(requestType.updateRequest));
                if (!result.error) {
                    dispatch(approveApplicationSuccess(uid));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //拒绝申请
    rejectApplication: (uid) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(requestType.updateRequest));
            return get(url.rejectApplication(uid)).then((result) => {
                dispatch(appActions.finishRequest(requestType.updateRequest));
                if (!result.error) {
                    dispatch(rejectApplicationSuccess(uid));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    ////////////////////////////////////
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


const convertEnterpriseCustomerApplicationsToPlainStructure = (data) => {
    let enterpriseCustomerApplications = new Array();
    let byEnterpriseCustomerApplications = new Object();
    data.forEach((item) => {
        enterpriseCustomerApplications.push(item.uid);
        if (!byEnterpriseCustomerApplications[item.uid]) {
            byEnterpriseCustomerApplications[item.uid] = item;
        }
    });
    return {
        enterpriseCustomerApplications,
        byEnterpriseCustomerApplications,
    }
}


const fetchEnterpriseCustomerApplicationsSuccess = ({ enterpriseCustomerApplications, byEnterpriseCustomerApplications }) => ({
    type: types.FETCH_ENTERPRISE_CUSTOMER_APPLICATIONS,
    enterpriseCustomerApplications,
    byEnterpriseCustomerApplications
})

const startApplicationCheckSuccess = (uid) => ({
    type: types.START_APPLICATION_CHECK,
    uid
})

const convertEnterpriseCustomerApplicationToPlainStructure = (data) => {
    let byEnterpriseBusinessLicense = data.enterprise.businessLicense;
    let byCustomerAvatar = data.applicant.avatar;
    return {
        enterpriseCustomerApplication: {
            ...data,
            enterprise: { ...data.enterprise, businessLicense: byEnterpriseBusinessLicense.uid },
            applicant: { ...data.applicant, avatar: byCustomerAvatar.uid }
        },
        byCustomerAvatar,
        byEnterpriseBusinessLicense
    }
}

const fetchApplicationSuccess = ({ enterpriseCustomerApplication, byCustomerAvatar, byEnterpriseBusinessLicense }) => ({
    type: types.FETCH_ENTERPRISE_CUSTOMER_APPLICATION,
    enterpriseCustomerApplication,
    byCustomerAvatar,
    byEnterpriseBusinessLicense
})

const approveApplicationSuccess = (uid) => ({
    type: types.APPROVE_APPLICATION,
    uid
})

const rejectApplicationSuccess = (uid) => ({
    type: types.REJECT_APPLICATION,
    uid
})
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


const fetchCustomerByIdSuccess = (customer) => ({
    type: types.FETCH_CUSTOMER_BY_ID,
    customer
})




const fetchCustomersSuccess = (type, { customers, byCustomers }) => ({
    type,
    customers,
    byCustomers,
})

const reducer = (state = initialState, action) => {
    let customers;
    let byCustomers;
    let byEnterpriseCustomerApplications;
    switch (action.type) {
        case types.FETCH_CUSTOMER_TYPES:
            return { ...state, customerTypes: action.customerTypes, byCustomerTypes: action.byCustomerTypes };
        case types.FETCH_ENTERPRISE_CUSTOMER_APPLICATIONS:
            return { ...state, enterpriseCustomerApplications: action.enterpriseCustomerApplications, byEnterpriseCustomerApplications: action.byEnterpriseCustomerApplications };
        case types.START_APPLICATION_CHECK:
            byEnterpriseCustomerApplications = { ...state.byEnterpriseCustomerApplications, [action.uid]: { ...state.byEnterpriseCustomerApplications[action.uid], status: "pending" } };
            return { ...state, byEnterpriseCustomerApplications };
        case types.FETCH_ENTERPRISE_CUSTOMER_APPLICATION:
            byEnterpriseCustomerApplications = { ...state.byEnterpriseCustomerApplications, [action.enterpriseCustomerApplication.uid]: action.enterpriseCustomerApplication };
            return { ...state, byEnterpriseCustomerApplications, byCustomerAvatar: action.byCustomerAvatar, byEnterpriseBusinessLicense: action.byEnterpriseBusinessLicense };
        case types.APPROVE_APPLICATION:
            byEnterpriseCustomerApplications = { ...state.byEnterpriseCustomerApplications, [action.uid]: { ...state.byEnterpriseCustomerApplications[action.uid], status: "approve" } };
            return { ...state, byEnterpriseCustomerApplications, byEnterpriseCustomerApplications };
        case types.REJECT_APPLICATION:
            byEnterpriseCustomerApplications = { ...state.byEnterpriseCustomerApplications, [action.uid]: { ...state.byEnterpriseCustomerApplications[action.uid], status: "reject" } };
            return { ...state, byEnterpriseCustomerApplications, byEnterpriseCustomerApplications };
        //////////////////////////////////////
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
export const getEnterpriseCustomerApplications = (state) => state.customer.enterpriseCustomerApplications;
export const getByEnterpriseCustomerApplications = (state) => state.customer.byEnterpriseCustomerApplications;
export const getByCustomerAvatar = (state) => state.customer.byCustomerAvatar;
export const getByEnterpriseBusinessLicense = (state) => state.customer.byEnterpriseBusinessLicense;
///////////////////////////////////////////
export const getCustomers = (state) => state.customer.customers;
export const getByCustomers = (state) => state.customer.byCustomers;
