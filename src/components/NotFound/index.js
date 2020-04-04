import React from "react";
import { Result, Button } from 'antd';
import { Link } from "react-router-dom";
import {actions as appActions} from "../../redux/modules/app";
import { map } from "../../router";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class NotFound extends React.Component {

  componentWillUnmount() {
    this.props.removeConnectError();
  }

  render() {
    const { from } = { from: { pathname: map.admin.AdminHome() } };//this.props.location.state || { from: { pathname: map.client.ClientHome() } };
    // console.log(from);
    return (<Result
      status="404"
      title="404"
      subTitle="抱歉，网络连接错误"
      extra={<Button type="primary"><Link to={from}>返回主页面</Link></Button>}
    />)
  }
}

const mapStateToProps = (state, props) => {
  return {
   
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(appActions, dispatch),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(NotFound);;