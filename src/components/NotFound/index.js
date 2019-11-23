import React from "react";
import { Result, Button } from 'antd';

function NotFound(props){
    return (<Result
    status="404"
    title="404"
    subTitle="抱歉，您浏览的页面不存在"
    extra={<Button type="primary">返回主页面</Button>}
  />)
}

export default NotFound;