import React from "react";
import { Result, Button } from 'antd';
import {Link} from "react-router-dom";
import {map} from "../../router";

function NotFound(props){
    return (<Result
    status="404"
    title="404"
    subTitle="抱歉，您浏览的页面不存在"
    extra={<Button type="primary"><Link to={{pathname:map.admin.AdminHome()}}>返回主页面</Link></Button>}
  />)
}

export default NotFound;