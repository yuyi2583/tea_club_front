import React, { Component } from "react";

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
        this.setState({
          // 同时兼容ES6和CommonJS的模块
          component: mod.default ? mod.default : mod
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