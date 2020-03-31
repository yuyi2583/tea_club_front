import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get, put, post, _delete } from "../../utils/request";
import { requestType, fetchOrdersTimeRange, fetchOrderStatus } from "../../utils/common";

const initialState = {
    orders: new Array(),
    byOrders: new Object(),
    // orderCustomers:new Array(),//订单所属客户列表
    byOrderCustomers: new Object(),
    // orderClerks:new Array(),//处理订单职员列表
    byOrderClerks: new Object(),
    byProducts: new Object(),//订单产品列表
    byOrderActivityRules: new Object(),//订单适用活动规则

}

export const types = {
    FETCH_ORDERS_BY_CUSTOMER: "ORDER/FETCH_ORDERS_BY_CUSTOMER",
    FETCH_UNCOMPLETE_ORDERS: "ORDER/FETCH_UNCOMPLETE_ORDERS",
    FETCH_ORDERS: "ORDER/FETCH_ORDERS",
    FETCH_ORDER: "ORDER/FETCH_ORDER",
    UPDATE_ORDER_STATUS: "ORDER/UPDATE_ORDER_STATUS",
    //////////////////////////////////////////////
    FETCH_LAST_THREE_MONTH_ORDERS: "ORDER/FETCH_LAST_THREE_MONTH_ORDERS",
    FETCH_TIME_RANGE_ORDERS: "ORDER/FETCH_TIME_RANGE_ORDERS",
    FETCH_ALL_ORDERS_BY_CUSTOMER: "ORDER/FETCH_ALL_ORDER_BY_CUSTOMER",
    FETCH_LAST_THREE_MONTH_ORDERS_BY_CUSTOMER: "ORDER/FETCH_LAST_THREE_MONTH_ORDERS_BY_CUSTOMER",
    FETCH_TIME_RANGE_ORDERS_BY_CUSTOMER: "ORDER/FETCH_TIME_RANGE_ORDERS_BY_CUSTOMER",
    DELETE_ORDER: "ORDER/DELETE_ORDER",
    DELETE_ORDERS_BY_BATCH: "ORDER/DELETE_ORDERS_BY_BATCH",
    FETCH_ORDER_BY_ID: "ORDER/FETCH_ORDER_BY_ID",
};

export const actions = {
    //获取客户订单列表
    fetchOrdersByCustomer: (customerId, timeRange = fetchOrdersTimeRange["last3Months"]()) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchOrdersByCustomer(customerId, timeRange)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchOrdersByCustomerSuccess(convertOrdersToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //获取未完成的订单列表
    fetchUncompleteOrders: () => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchUncompleteOrders()).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchUncompleteOrdersSuccess(convertOrdersToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //根据条件获取订单列表
    fetchOrders: (status = fetchOrderStatus.all, timeRange = fetchOrdersTimeRange.all) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchOrders(status, timeRange)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchOrdersSuccess(convertOrdersToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //根据uid获取订单详细信息
    fetchOrder: (uid) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchOrder(uid)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchOrderSuccess(convertOrderToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //更新订单状态
    updateOrderStatus: (status, value) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(requestType.modalRequest));
            const params = { ...value };
            return put(url.updateOrderStatus(status), params).then((result) => {
                dispatch(appActions.finishRequest(requestType.modalRequest));
                if (!result.error) {
                    dispatch(updateOrderStatusSuccess(convertOrderToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            });
        }
    }
    /////////////////////////////////////////////
    // deleteOrder: (uid, reqType = requestType.appRequest) => {
    //     return (dispatch) => {
    //         dispatch(appActions.startRequest(reqType));
    //         const params = { uid };
    //         return get(url.deleteOrder(), params).then((data) => {
    //             dispatch(appActions.finishRequest(reqType));
    //             if (!data.error) {
    //                 dispatch(deleteOrderSuccess(types.DELETE_ORDER, convetOrdersToPlainStructure(data.orders)));
    //                 return Promise.resolve();
    //             } else {
    //                 dispatch(appActions.setError(data.error));
    //                 return Promise.reject();
    //             }
    //         });
    //     }
    // },
    // deleteOrdersByBatch: (orders, reqType = requestType.appRequest) => {
    //     console.log("delete orders", orders);
    //     return (dispatch) => {
    //         dispatch(appActions.startRequest(reqType));
    //         const params = { orders };
    //         return get(url.deleteOrderByBatch(), params).then((data) => {
    //             dispatch(appActions.finishRequest(reqType));
    //             if (!data.error) {
    //                 dispatch(deleteOrderSuccess(types.DELETE_ORDERS_BY_BATCH, convetOrdersToPlainStructure(data.orders)));
    //                 return Promise.resolve();
    //             } else {
    //                 dispatch(appActions.setError(data.error));
    //                 return Promise.reject();
    //             }
    //         });
    //     }
    // },
    // fetchOrders: (timeRange = fetchOrdersTimeRange["last3Months"], reqType = requestType.appRequest) => {
    //     return (dispatch) => {
    //         dispatch(appActions.startRequest(reqType));
    //         const params = { ...timeRange };
    //         return get(url.fetchOrdersByCustomer(), params).then((data) => {
    //             dispatch(appActions.finishRequest(reqType));
    //             if (!data.error) {
    //                 if (timeRange == fetchOrdersTimeRange["last3Months"])
    //                     dispatch(fetchOrdersSuccess(types.FETCH_LAST_THREE_MONTH_ORDERS, convetOrdersToPlainStructure(data.orders)));
    //                 else if (timeRange == fetchOrdersTimeRange["all"])
    //                     dispatch(fetchOrdersSuccess(types.FETCH_ALL_ORDERS, convetOrdersToPlainStructure(data.orders)));
    //                 else
    //                     dispatch(fetchOrdersSuccess(types.FETCH_TIME_RANGE_ORDERS, convetOrdersToPlainStructure(data.orders)));
    //                 return Promise.resolve();
    //             } else {
    //                 dispatch(appActions.setError(data.error));
    //                 return Promise.reject();
    //             }
    //         });
    //     }
    // },
    // fetchOrderById: (orderId, reqType = requestType.appRequest) => {
    //     return (dispatch) => {
    //         dispatch(appActions.startRequest(reqType));
    //         const params = { uid: orderId };
    //         return get(url.fetchOrderById(), params).then((data) => {
    //             dispatch(appActions.finishRequest(reqType));
    //             if (!data.error) {
    //                 dispatch(fetchOrderSuccess(data.order));
    //                 return Promise.resolve();
    //             } else {
    //                 dispatch(appActions.setError(data.error));
    //                 return Promise.reject();
    //             }
    //         });
    //     }
    // },
}

const convertOrdersToPlainStructure = (data) => {
    let orders = new Array();
    let byOrders = new Object();
    // let orderActivityRules = new Array();
    // let byOrderActivityRules = new Object();
    let byOrderClerks = new Object();
    let byOrderCustomers = new Object();
    let byProducts = new Object();
    data.forEach((order) => {
        let products = new Array();
        orders.push(order.uid);
        byOrderCustomers = { ...byOrderCustomers, [order.customer.uid]: order.customer };
        byOrderClerks = { ...byOrderClerks, [order.clerk.uid]: order.clerk };
        order.products.forEach(product => {
            products.push(product.uid);
            if (!byProducts[product.uid]) {
                byProducts[product.uid] = product;
            }
        });
        if (!byOrders[order.uid]) {
            byOrders[order.uid] = { ...order, customer: order.customer.uid, clerk: order.clerk.uid, products };
        }
    });
    return {
        orders,
        byOrders,
        byOrderClerks,
        byOrderCustomers,
        byProducts
    }
};


const fetchOrdersByCustomerSuccess = ({ orders, byOrders, byOrderClerks, byOrderCustomers, byProducts }) => ({
    type: types.FETCH_ORDERS_BY_CUSTOMER,
    orders,
    byOrders,
    byOrderClerks,
    byOrderCustomers,
    byProducts
});

const fetchUncompleteOrdersSuccess = ({ orders, byOrders, byOrderClerks, byOrderCustomers, byProducts }) => ({
    type: types.FETCH_UNCOMPLETE_ORDERS,
    orders,
    byOrders,
    byOrderClerks,
    byOrderCustomers,
    byProducts
});

const fetchOrdersSuccess = ({ orders, byOrders, byOrderClerks, byOrderCustomers, byProducts }) => ({
    type: types.FETCH_ORDERS,
    orders,
    byOrders,
    byOrderClerks,
    byOrderCustomers,
    byProducts
});

const convertOrderToPlainStructure = (data) => {
    // let orders = new Array();
    // let byOrders = new Object();
    // let orderActivityRules = new Array();
    let byOrderActivityRules = new Object();
    let byOrderClerks = new Object();
    let byOrderCustomers = new Object();
    let byProducts = new Object();
    // data.forEach((order) => {

    let products = new Array();
    // orders.push(order.uid);
    byOrderCustomers = { [data.customer.uid]: data.customer };
    byOrderClerks = { [data.clerk.uid]: data.clerk };
    data.products.forEach(product => {
        products.push(product.uid);
        if (!byOrderActivityRules[product.activityRule.uid]) {
            byOrderActivityRules[product.activityRule.uid] = product.activityRule;
        }
        if (!byProducts[product.uid]) {
            byProducts[product.uid] = { ...product, activityRule: product.activityRule.uid };
        }
    });
    // if (!byOrders[order.uid]) {
    const order = { ...data, customer: data.customer.uid, clerk: data.clerk.uid, products };
    // }
    // });
    return {
        order,
        byOrderClerks,
        byOrderCustomers,
        byProducts,
        byOrderActivityRules
    }
}

const fetchOrderSuccess = ({ order, byOrderClerks, byOrderCustomers, byProducts, byOrderActivityRules }) => ({
    type: types.FETCH_ORDER,
    order,
    byOrderClerks,
    byOrderCustomers,
    byProducts,
    byOrderActivityRules
})

const updateOrderStatusSuccess = ({ order, byOrderClerks, byOrderCustomers, byProducts, byOrderActivityRules }) => ({
    type: types.FETCH_ORDER,
    order,
    byOrderClerks,
    byOrderCustomers,
    byProducts,
    byOrderActivityRules
})
/////////////////////////////////////////


const deleteOrderSuccess = (type, { orders, byOrders }) => ({
    type,
    orders,
    byOrders
})



const reducer = (state = initialState, action) => {
    let orders;
    let byOrders;
    let byOrderClerks;
    let byOrderCustomers;
    let byProducts;
    switch (action.type) {
        case types.FETCH_ORDERS:
        case types.FETCH_ORDERS_BY_CUSTOMER:
        case types.FETCH_UNCOMPLETE_ORDERS:
            return {
                ...state, orders: action.orders, byOrders: action.byOrders,
                byOrderClerks: action.byOrderClerks, byOrderCustomers: action.byOrderCustomers, byProducts: action.byProducts
            };
        case types.UPDATE_ORDER_STATUS:
        case types.FETCH_ORDER:
            byOrders = { ...state.byOrders, [action.order.uid]: action.order };
            byOrderClerks = { ...state.byOrderClerks, ...action.byOrderClerks };
            byOrderCustomers = { ...state.byOrderCustomers, ...action.byOrderCustomers };
            byProducts = { ...state.byProducts, ...action.byProducts };
            return { ...state, byOrders, byOrderClerks, byOrderCustomers, byProducts, byOrderActivityRules: action.byOrderActivityRules };

        /////////////////////////////////////////
        case types.FETCH_ALL_ORDERS_BY_CUSTOMER:
        case types.FETCH_LAST_THREE_MONTH_ORDERS_BY_CUSTOMER:
        case types.FETCH_TIME_RANGE_ORDERS_BY_CUSTOMER:
        case types.FETCH_ALL_ORDERS:
        case types.FETCH_LAST_THREE_MONTH_ORDERS:
        case types.FETCH_TIME_RANGE_ORDERS:
        case types.DELETE_ORDER:
        case types.DELETE_ORDERS_BY_BATCH:
            return { ...state, orders: action.orders, byOrders: action.byOrders };
        case types.FETCH_ORDER_BY_ID:
            orders = state.orders;
            if (orders.indexOf(action.order.uid) == -1) {
                orders.push(action.order.uid);
            }
            byOrders = { ...state.byOrders, [action.order.uid]: action.order };
            return { ...state, orders, byOrders };
        default:
            return state;
    }
}

export default reducer;

export const getOrders = (state) => state.order.orders;
export const getByOrders = (state) => state.order.byOrders;
export const getByProducts = (state) => state.order.byProducts;
export const getByOrderCustomers = (state) => state.order.byOrderCustomers;
export const getByOrderClerks = (state) => state.order.byOrderClerks;
export const getByOrderActivityRules = (state) => state.order.byOrderActivityRules;
