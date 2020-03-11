import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get } from "../../utils/request";
import { requestType, fetchOrdersTimeRange } from "../../utils/common";

const initialState = {
    orders: new Array(),
    byOrders: new Object(),
}

export const types = {
    FETCH_ALL_ORDERS: "ORDER/FETCH_ALL_ORDERS",
    FETCH_LAST_THREE_MONTH_ORDERS: "ORDER/FETCH_LAST_THREE_MONTH_ORDERS",
    FETCH_ALL_ORDERS_BY_CUSTOMER: "ORDER/FETCH_ALL_ORDER_BY_CUSTOMER",
    FETCH_LAST_THREE_MONTH_ORDERS_BY_CUSTOMER: "ORDER/FETCH_LAST_THREE_MONTH_ORDERS_BY_CUSTOMER",
    FETCH_TIME_RANGE_ORDERS_BY_CUSTOMER: "ORDER/FETCH_TIME_RANGE_ORDERS_BY_CUSTOMER",
    DELETE_ORDER: "ORDER/DELETE_ORDER",
    DELETE_ORDERS_BY_BATCH: "ORDER/DELETE_ORDERS_BY_BATCH",
};

export const actions = {
    fetchOrdersByCustomer: (customerId, timeRange = fetchOrdersTimeRange["last3Months"], reqType = requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            const params = { customerId, timeRange };
            return get(url.fetchOrdersByCustomer(), params).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    if (timeRange == fetchOrdersTimeRange["last3Months"])
                        dispatch(fetchOrdersByCustomerSuccess(types.FETCH_LAST_THREE_MONTH_ORDERS_BY_CUSTOMER, convetOrdersToPlainStructure(data.orders)));
                    else if (timeRange == fetchOrdersTimeRange["all"])
                        dispatch(fetchOrdersByCustomerSuccess(types.FETCH_ALL_ORDERS_BY_CUSTOMER, convetOrdersToPlainStructure(data.orders)));
                    else
                        dispatch(fetchOrdersByCustomerSuccess(types.FETCH_TIME_RANGE_ORDERS_BY_CUSTOMER, convetOrdersToPlainStructure(data.orders)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject();
                }
            });
        }
    },
    deleteOrder: (uid, reqType = requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            const params = { uid };
            return get(url.deleteOrder(), params).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(deleteOrderSuccess(types.DELETE_ORDER, convetOrdersToPlainStructure(data.orders)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject();
                }
            });
        }
    },
    deleteOrdersByBatch: (orders, reqType = requestType.appRequest) => {
        console.log("delete orders",orders);
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            const params = { orders };
            return get(url.deleteOrderByBatch(), params).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(deleteOrderSuccess(types.DELETE_ORDERS_BY_BATCH, convetOrdersToPlainStructure(data.orders)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject();
                }
            });
        }
    },
}

const convetOrdersToPlainStructure = (data) => {
    let orders = new Array();
    let byOrders = new Object();
    data.forEach((item) => {
        orders.push(item.uid);
        if (!byOrders[item.uid]) {
            byOrders[item.uid] = { ...item };
        }
    });
    return {
        orders,
        byOrders
    }
}

const deleteOrderSuccess = (type, { orders, byOrders }) => ({
    type,
    orders,
    byOrders
})

const fetchOrdersByCustomerSuccess = (type, { orders, byOrders }) => ({
    type,
    orders,
    byOrders,
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_ALL_ORDERS_BY_CUSTOMER:
        case types.DELETE_ORDER:
        case types.DELETE_ORDERS_BY_BATCH:
        case types.FETCH_LAST_THREE_MONTH_ORDERS_BY_CUSTOMER:
            return { ...state, orders: action.orders, byOrders: action.byOrders };
        default:
            return state;
    }
}

export default reducer;

export const getOrders = (state) => state.order.orders;
export const getByOrders = (state) => state.order.byOrders;
