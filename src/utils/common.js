import { getNDaysAgoTimeStamp } from "./timeUtil";

export const sex = {
    1: "男",
    2: "女"
}

export const activityType = {
    "1": "满减",
    "2": "折扣",
}

export const requestType = {
    "retrieveRequest": 0,
    "updateRequest": 1,
    "modalRequest": 2,
}

export const activityStatus = {
    "upcoming": "未开始",
    "ongoing": "进行中",
    "expired": "已结束"
}

export const formItemLayout = {
    labelCol: {
        xs: { span: 2 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 6 },
        sm: { span: 14 },
    },
};

export const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 8,
            offset: 8,
        },
        sm: {
            span: 8,
            offset: 8,
        },
    },
};

export const productStatus = {
    "off_shelves": "已下架",
    "on_sale": "销售中",
    "sold_out": "售罄"
};

export const enterpriseCustomerApplicationStatus = {
    "submit": "未审核",
    "pending": "审核中",
    "approve": "审核通过",
    "reject": "审核未通过"
}

export const fetchTimeRange = {
    all: () => ({ startDate: -1, endDate: getNDaysAgoTimeStamp(-1) }),
    last3Months: () => ({ startDate: getNDaysAgoTimeStamp(90), endDate: getNDaysAgoTimeStamp(-1) }),
}

export const orderStatus = {
    "payed": "买家已付款",
    "shipped": "卖家已发货",
    "requestRefund":"买家申请退款",
    "refunded": "卖家已退款",
    "complete": "完成",
    "rejectRefund":"卖家拒绝退款"
}

export const fetchOrderStatus={
    "all":"all",
    "payed":"payed",
    "shipped":"shipped",
    "requestRefund":"requestRefund",
    "refunded":"refunded",
    "complete":"complete",
    "rejectRefund":"rejectRefund",
}

export const fetchArticleStatus={
    "all":"all",
    "valid":"valid",
    "invalid":"invalid",
}