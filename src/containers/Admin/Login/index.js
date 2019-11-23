import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {actions as authActions,getAuth} from "../../../redux/modules/auth";
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import "./style.css";
import {Redirect} from "react-router-dom";
import {map} from "../../../router/map";

class NormalLoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state={
            redirectToReferrer:false
        }
    }

    componentWillReceiveProps(nextProps){
      const isLogged=!this.props.auth.userId&&nextProps.auth.userId;
      if(isLogged){
        this.setState({
          redirectToReferrer:true
        });
      }
    }

    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.login(values.username,values.password);
        }
      });
    };
  
    render() {
      const {redirectToReferrer}=this.state;
      const { from } = this.props.location.state || { from: { pathname:map.AdminHome()  } };
      if(redirectToReferrer){
        return <Redirect to={from} />;
      }
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>记住我</Checkbox>)}
            <a className="login-form-forgot" href="">
              忘记密码
            </a>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      );
    }
  }

const mapStateToProps=(state,props)=>{
    return {
        auth:getAuth(state)
    };
};

const mapDispatchToProps=(dispatch)=>{
    return {
        ...bindActionCreators(authActions,dispatch)
    };
};

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);
export default connect(mapStateToProps,mapDispatchToProps)(WrappedNormalLoginForm);