import { Button, Tooltip } from "antd";
import React from "react";
import { activityStatus } from "../../../../utils/common";

export const getExtra = ({ history, match }) => {
    let extra = null;
    if (history.location.pathname.indexOf("role_detail") != -1) {
        extra = (<Button type="primary" onClick={this.startAlterRoleDetail}>修改职员信息</Button>);
    } else {
        extra = null;
    }
    return extra;
}

export const getSubTitle = ({ history }) => {
    let subTitle = null;
    if (history.location.pathname.indexOf("new_role_detail") != -1) {
        subTitle = "新增职员详情";
    } else {
        subTitle = null;
    }
    return subTitle;
}

export const judgeStatus = (activity) => {
    if (!activity) {
        return null;
    }
    let time = new Date().getTime();
    let status = activityStatus["upcoming"];
    if (time > activity.startTime && time < activity.endTime) {
        status = activityStatus["ongoing"];
    } else if (time > activity.endTime) {
        status = activityStatus["expired"];
    }
    if (activity.enforceTerminal) {
        status = activityStatus["expired"];
    }
    return status;
}