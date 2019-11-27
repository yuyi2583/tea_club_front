import React, { Component } from "react";
import CompanyInfo from "../containers/Admin/CompanyInfo";

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
      console.log("companyInfo class:"+CompanyInfo);
      importComponent().then((mod) => {
        const component=mod.default ? mod.default : mod;
        console.log("flag in async:"+component);
        // AsyncComponent.flag=mod.default.flag;
        this.setState({
          // 同时兼容ES6和CommonJS的模块
          component
        });
      });
    }

    render() {
      const C = this.state.component;
      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}