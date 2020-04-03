import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as authActions } from "../../../redux/modules/adminAuth";
import { totalCountDown } from "../../../redux/modules/ui";
import { Form, Icon, Input, Button, Spin, Row, Col } from 'antd';
import "./style.css";
import { Redirect, Link } from "react-router-dom";
import { map } from "../../../router";
import validator from "../../../utils/validator";

const InputGroup = Input.Group;

class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      loginType: "id",
      error: "",
      countDown: totalCountDown,
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { loginType } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ error: "" });
        if (loginType == "id") {
          this.props.idPswLogin(values)
            .then(() => {
              //登陆成功
              this.setState({ redirectToReferrer: true })
            })
            .catch(error => {
              this.setState({ error });
            });
        } else {
          console.log("sms");
          this.props.otpLogin(values)
            .then(() => {
              //登陆成功
              this.setState({ redirectToReferrer: true })
            })
            .catch(error => {
              this.setState({ error });
            });
        }
      }
    });
  };

  //改变登陆方式
  switchLoginType = (e) => {
    e.preventDefault();
    this.setState({ loginType: e.target.name });
  }

  //发送短信验证码
  sendOtp = () => {
    const { getFieldValue } = this.props.form;
    const contact = getFieldValue("contact")
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(contact))) {
      alert("手机号码有误，请重填");
      return;
    }
    this.setState({error:""});
    this.props.sendClerkOtp(contact)
      .then(() => {
        this.timer = setInterval(() => {
          const countDown = this.state.countDown - 1;
          if (countDown >= 0) {
            this.setState({ countDown });
          } else {
            this.setState({ countDown: totalCountDown });
            clearInterval(this.timer);
          }
        }, 1000);
      })
      .catch(error => {
        this.setState({ error })
      })

  }

  render() {
    const { redirectToReferrer, loginType, error, countDown } = this.state;
    const { from } = this.props.location.state || { from: { pathname: map.admin.AdminHome() } };
    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    const { getFieldDecorator } = this.props.form;
    const { retrieveRequestQuantity, modalRequestQuantity } = this.props;
    return (
      <div id="admin-login-root">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <div style={{ color: "red", height: "18px" }}>{error}</div>
          {loginType == "sms" ?
            <div>
              <Form.Item>
                <InputGroup>
                  <Row gutter={8}>
                    <Col span={5}>
                      <Input defaultValue="+86" disabled />
                    </Col>
                    <Col span={19}>
                      {getFieldDecorator('contact', {
                        rules: [{ required: true, message: '请输入手机号' }, validator.phone],
                      })(
                        <Input
                          suffix={
                            <Spin spinning={modalRequestQuantity > 0}>
                              <Button type="link" size="small" disabled={countDown >= 0 && countDown < totalCountDown} onClick={this.sendOtp}>
                                {countDown >= 0 && countDown < totalCountDown ? countDown + "s后重新获取验证码" : "获取验证码"}
                              </Button>
                            </Spin>
                          }
                          placeholder="手机号"
                        />,
                      )}
                    </Col>
                  </Row>
                </InputGroup>
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('otp', {
                  rules: [{ required: true, message: '请输入验证码' }, validator.otp],
                })(
                  <Input
                    prefix={<Icon type="profile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="6位数字验证码"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                <a className="login-form-sms" name="id" onClick={this.switchLoginType}>使用身份证密码登陆</a>
              </Form.Item>
            </div> :
            <div>
              <Form.Item>
                {getFieldDecorator('identityId', {
                  rules: [{ required: true, message: '请输入身份证号!' }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="身份证号"
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
                <Link className="login-form-forget" to={{
                  pathname: map.admin.AdminForgetPsw(),
                  state: { from }
                }}>忘记密码</Link>
                <a className="login-form-sms" name="sms" onClick={this.switchLoginType}>使用短信验证码登陆</a>
              </Form.Item>
            </div>
          }
          <Button type="primary" htmlType="submit" className="login-form-button" loading={retrieveRequestQuantity > 0}>
            登录
              </Button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    // auth:getAuth(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(authActions, dispatch)
  };
};

const WrappedNormalLoginForm = Form.create({ name: 'login' })(NormalLoginForm);
export default connect(mapStateToProps, mapDispatchToProps)(WrappedNormalLoginForm);