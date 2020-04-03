import React, { Component } from "react";
import { Form, Icon, Input, Button, Row, Col, } from 'antd';
import "./style.css";
import { actions as uiActions, getCountDown, totalCountDown } from "../../../redux/modules/ui";
import { bindActionCreators } from "redux";
import { actions as authActions } from "../../../redux/modules/adminAuth";
import { connect } from "react-redux";
import { map } from "../../../router";
import { Link, Redirect } from "react-router-dom";

const InputGroup = Input.Group;

class ForgetPsw extends Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            redirectToReferrer: false
        }
    }

    componentWillReceiveProps(nextProps) {
        const isLogged = !this.props.auth.userId && nextProps.auth.userId;
        if (isLogged) {
            this.setState({
                redirectToReferrer: true
            });
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                const { phoneNumber, verifyNumber, idNumber, password } = values;
                this.props.forgetPsw(phoneNumber, verifyNumber, idNumber, password);
            }
        });
    };

    handleClick = () => {
        this.timer = setInterval(() => {
            const countDown = this.props.countDown - 1;
            if (countDown >= 0) {
                this.props.startCountDown(countDown);
            } else {
                this.props.finishCountDown();
                clearInterval(this.timer);
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        const { redirectToReferrer } = this.state;
        const { from } = this.props.location.state || { from: { pathname: map.AdminHome() } };
        if (redirectToReferrer) {
            return <Redirect to={from} />;
        }
        const { getFieldDecorator } = this.props.form;
        const { countDown } = this.props;
        return (
            <div id="admin-forget-root">
                <Form onSubmit={this.handleSubmit} className="forget-form">
                    <Form.Item>
                        <Link to={map.admin.AdminLogin()} style={{ color: 'rgba(0,0,0,.25)' }}>
                            <Icon type="double-left" style={{ color: 'rgba(0,0,0,.25)' }} />
                            &nbsp;返回登录
                        </Link>
                    </Form.Item>
                    <Form.Item>
                        <InputGroup>
                            <Row gutter={8}>
                                <Col span={5}>
                                    <Input defaultValue="+86" disabled />
                                </Col>
                                <Col span={19}>
                                    {getFieldDecorator('phoneNumber', {
                                        rules: [{ required: true, message: '请输入手机号' }],
                                    })(
                                        <Input
                                            suffix={
                                                <Button type="link" size="small" onClick={this.handleClick}>
                                                    {countDown >= 0 && countDown < totalCountDown ? countDown + "s" : "获取验证码"}
                                                </Button>
                                            }
                                            placeholder="手机号"
                                        />,
                                    )}
                                </Col>
                            </Row>
                        </InputGroup>
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('verifyNumber', {
                            rules: [{ required: true, message: '请输入验证码' }],
                        })(
                            <Input
                                prefix={<Icon type="profile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="6位数字验证码"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('idNumber', {
                            rules: [{ required: true, message: '请输入身份证号' }],
                        })(
                            <Input
                                prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="身份证号"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入重置密码' }],
                        })(
                            <Input.Password
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="重置密码"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="forget-form-button">重置</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const WrappedForgetPswForm = Form.create({ name: 'admin_forget_psw' })(ForgetPsw);

const mapStateToProps = (state, props) => {
    return {
        countDown: getCountDown(state),
        // auth: getAuth(state)
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators({ ...uiActions, ...authActions }, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WrappedForgetPswForm);
