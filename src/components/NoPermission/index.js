import { Result, Icon, Button } from 'antd';
import React from "react";

function NoPermission(props) {
    return (
        <Result
            icon={<Icon type="smile" theme="twoTone" />}
            title="很抱歉，您没有这项权限"
        />
    )
}

export default NoPermission;
