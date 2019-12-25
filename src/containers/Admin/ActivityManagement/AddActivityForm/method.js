import {Button} from "antd";
import React from "react";

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