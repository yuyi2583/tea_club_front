import React, { Component } from "react";
import CompanyInfo from "../containers/Admin/CompanyInfo";
import { handleBack, callMessage } from "./commonUtils";
import { Button } from "antd";
import { actions as uiActions, getAlterInfoState, getModalLoading, getModalVisible } from "../redux/modules/ui";
import { getRequestQuantity, getModalRequestQuantity } from "../redux/modules/app";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

//此高阶组件作用为代码分片

//importComponent是使用了import()的函数
export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        component: null,
      };
    }

    componentDidMount() {
      importComponent().then((mod) => {
        const component = mod.default ? mod.default : mod;
        this.setState({
          // 同时兼容ES6和CommonJS的模块
          component
        });
      });
    }

    getExtra = () => {
      const { history, match } = this.props;
      let extra = null;
      if (history.location.pathname.indexOf("/activity/") != -1) {
        extra = (<Button type="primary" onClick={this.props.startAlterInfo}>修改活动信息</Button>);
      } else if (history.location.pathname.indexOf("role_detail") != -1) {
        extra = (<Button type="primary" onClick={this.props.startAlterInfo}>修改职员信息</Button>);
      } else if (history.location.pathname === "/administrator/company/shop_management") {
        extra = (
          <Link to={`${match.url}/addShop`}>
            <Button type="primary">新增门店</Button>
          </Link>);
      } else if (history.location.pathname.indexOf("boxInfo") != -1) {
        extra = (<Button type="primary" onClick={this.props.startAlterInfo}>修改包厢信息</Button>);
      } else if (history.location.pathname.indexOf("/product/") != -1) {
        extra = (<Button type="primary" onClick={this.props.startAlterInfo}>修改产品</Button>);
      } else {
        extra = null;
      }
      return extra;
    }

    componentWillMount() {
      this.props.finishAlterInfo();
    }

    getSubTitle = () => {
      const { history } = this.props;
      let subTitle = null;
      if (history.location.pathname.indexOf("new_role_detail") != -1) {
        subTitle = "新增职员详情";
      } else if (history.location.pathname.indexOf("role_detail") != -1) {
        subTitle = "职员详情";
      } else if (history.location.pathname.indexOf("addShop") != -1) {
        subTitle = "新增门店";
      } else if (history.location.pathname.indexOf("boxInfo") != -1) {
        subTitle = "包厢信息";
      } else if (history.location.pathname.indexOf("addBox") != -1) {
        subTitle = "新增包厢";
      } else if (history.location.pathname.indexOf("clerkDetail") != -1) {
        subTitle = "职员信息";
      } else if (history.location.pathname.indexOf("/activity/") != -1) {
        subTitle = "活动信息";
      } else if (history.location.pathname.indexOf("/product/") != -1) {
        subTitle = "产品信息";
      } else if (history.location.pathname.indexOf("/customer/") != -1) {
        subTitle = "客户信息";
      } else {
        subTitle = null;
      }
      return subTitle;
    }

    render() {
      const C = this.state.component;
      return C ? <C {...this.props}
        callMessage={callMessage}
        handleBack={handleBack}
        getExtra={this.getExtra}
        getSubTitle={this.getSubTitle}
      /> : null;
    }
  }


  const mapStateToProps = (state, props) => {
    return {
      alterInfo: getAlterInfoState(state),
      requestQuantity: getRequestQuantity(state),
      modalRequestQuantity: getModalRequestQuantity(state),
      modalLoading: getModalLoading(state),
      modalVisible: getModalVisible(state),
    };
  };

  const mapDispatchToProps = (dispatch) => {
    return {
      ...bindActionCreators(uiActions, dispatch),
    };
  };

  return connect(mapStateToProps, mapDispatchToProps)(AsyncComponent);
}