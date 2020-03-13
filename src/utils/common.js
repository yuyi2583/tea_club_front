import { getNDaysAgoTimeStamp } from "./timeUtil";

export const sex = {
    "0": "男",
    "1": "女"
}

export const activityType = {
    "1": "满减",
    "2": "折扣",
}

export const requestType = {
    "retrieveRequest": 0,
    "updateRequest":1,
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
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 6 },
        sm: { span: 12 },
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
    0: "已下架",
    1: "销售中"
};

export const enterpriseCustomerApplicationStatus = {
    0: "未审核",
    1: "审核中",
    2: "审核通过",
    3: "审核未通过"
}

export const fetchOrdersTimeRange = {
    all: () => ({ startDate: -1, endDate: getNDaysAgoTimeStamp(-1) }),
    last3Months: () => ({ startDate: getNDaysAgoTimeStamp(90), endDate: getNDaysAgoTimeStamp(-1) }),
}

export const orderStatus = {
    0: "未付款",
    1: "未配送",
    2: "已发货",
    3: "完成"
}