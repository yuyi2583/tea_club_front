import { message } from "antd";

export const handleBack = () => {
    window.history.back();
}

export const callMessage = (type = "success", content = "操作成功！") => {
    switch (type) {
        case "success":
            message.success(content);
            break;
        case "error":
            message.error(content);
            break;
        case "warning":
            message.warning(content);
            break;
    }
}

export const sex = {
    "0": "男",
    "1": "女"
}

export const activityType = {
    "1": "满减",
    "2": "折扣",
}

export const requestType = {
    "appRequest": 0,
    "modalRequest": 1,
}

export const activityStatus={
    "upcoming":"未开始",
    "ongoing":"进行中",
    "expired":"已结束"
}


