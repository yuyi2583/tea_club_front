import React from "react";
import { Descriptions, Input, Button, Row, Spin, Col, notification, PageHeader, Form, Modal, Skeleton } from 'antd';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { map } from "../../../router";
import { actions as appActions, getCompanyInfo, getError, getRetrieveRequestQuantity } from "../../../redux/modules/app";
import { requestType } from "../../../utils/common";

const { confirm } = Modal;

class CompanyInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.companyInfo
            // companyName: "",
            // postCode: "",
            // contact: "",
            // websiteName: "",
            // weChatOfficialAccount: "",
            // address: ""
        }
    }
    alterCompanyInfo = () => {
        this.props.startAlterInfo();
    }

    handleCancelAlter = () => {
        this.setState({ ...this.props.companyInfo });
        this.props.finishAlterInfo();
    }


    completeAlter = () => {
        const info = this.state;
        for (var key in info) {
            if (info[key].length == 0) {
                notification["error"]({
                    message: '信息缺失',
                    description:
                        '输入框不能为空！！！',
                });
                return;
            }
        }
        this.props.alterCompanyInfo(info);
    }

    // componentWillUnmount(){
    //     this.props.finishAlterInfo();
    // }

    handleChange = (e) => {
        const name = e.target.name;
        this.setState({
            [name]: e.target.value
        })
    }

    handleSubmit = e => {
        e.preventDefault();
        const thiz = this;
        const { companyInfo } = this.props;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                confirm({
                    title: '确认修改?',
                    content: '输入数据是否无误，确认修改公司信息',
                    onCancel() {
                    },
                    onOk() {
                        values = { ...values, uid: companyInfo.uid };
                        console.log("submit values", values);
                        thiz.props.alterCompanyInfo(values)
                            .then(() => {
                                thiz.props.callMessage("success", "修改公司信息成功！");
                                thiz.props.finishAlterInfo();
                            })
                            .catch((err) => {
                                thiz.props.callMessage("error", "修改公司信息失败！" + err.msg)
                            })
                    },
                });

            }
        });
    };

    componentDidMount() {
        this.props.fetchCompanyInfo();
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: map.admin.AdminHome() } };
        const { companyInfo, alterInfo, retrieveRequestQuantity, updateRequestQuantity, connectError } = this.props;
        if (connectError) {
            return <Redirect to={{
                pathname: map.error(),
                state: { from }
            }} />
        }
        const subTitle = this.props.getSubTitle();
        const extra = this.props.getExtra();
        const { getFieldDecorator } = this.props.form;
        return (
            <PageHeader
                title="公司信息"
                subTitle={subTitle}
                onBack={this.props.handleBack}
                extra={extra}>
                {retrieveRequestQuantity > 0 ?
                    <Skeleton active /> :
                    <Spin spinning={updateRequestQuantity > 0}>
                        <Form onSubmit={this.handleSubmit}>
                            <Descriptions column={2} bordered>
                                <Descriptions.Item label="公司名称">
                                    {!alterInfo ? companyInfo.companyName :
                                        <Form.Item>
                                            {getFieldDecorator('companyName', {
                                                rules: [{ required: true, message: '请输入公司名称!' }],
                                                initialValue: companyInfo.companyName
                                            })(<Input allowClear name="companyName" placeholder="请输入产品名称！" />)}
                                        </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="邮编">
                                    {!alterInfo ? companyInfo.postCode :
                                        <Form.Item>
                                            {getFieldDecorator('postCode', {
                                                rules: [{ required: true, message: '请输入邮编!' }],
                                                initialValue: companyInfo.postCode
                                            })(<Input allowClear name="postCode" placeholder="请输入邮编！" />)}
                                        </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="联系方式">
                                    {!alterInfo ? companyInfo.contact :
                                        <Form.Item>
                                            {getFieldDecorator('contact', {
                                                rules: [{ required: true, message: '请输入联系方式!' }],
                                                initialValue: companyInfo.contact
                                            })(<Input allowClear name="contact" placeholder="请输入联系方式！" />)}
                                        </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="平台名称">
                                    {!alterInfo ? companyInfo.websiteName :
                                        <Form.Item>
                                            {getFieldDecorator('websiteName', {
                                                rules: [{ required: true, message: '请输入平台名称!' }],
                                                initialValue: companyInfo.websiteName
                                            })(<Input allowClear name="websiteName" placeholder="请输入平台名称！" />)}
                                        </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="微信公众号">
                                    {!alterInfo ? companyInfo.weChatOfficialAccount :
                                        <Form.Item>
                                            {getFieldDecorator('weChatOfficialAccount', {
                                                rules: [{ required: true, message: '请输入微信公众号!' }],
                                                initialValue: companyInfo.weChatOfficialAccount
                                            })(<Input allowClear name="weChatOfficialAccount" placeholder="请输入微信公众号！" />)}
                                        </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="地址">
                                    {!alterInfo ? companyInfo.address :
                                        <Form.Item>
                                            {getFieldDecorator('address', {
                                                rules: [{ required: true, message: '请输入地址!' }],
                                                initialValue: companyInfo.address
                                            })(<Input allowClear name="address" placeholder="请输入地址！" />)}
                                        </Form.Item>
                                    }
                                </Descriptions.Item>
                            </Descriptions>
                            {alterInfo &&
                                <Row style={{ margin: "20px 0" }}>
                                    <Col span={12} offset={4}>
                                        <Button type="primary" htmlType="submit" block>确认修改</Button>
                                    </Col>
                                    <Col span={4} push={4}>
                                        <Button block onClick={() => this.props.finishAlterInfo()}>取消修改</Button>
                                    </Col>
                                </Row>
                            }
                        </Form>
                    </Spin>}
            </PageHeader>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        companyInfo: getCompanyInfo(state),
        error: getError(state),
        requestQuantity: getRetrieveRequestQuantity(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(appActions, dispatch),
    }
}

const WrapedCompanyInfo = Form.create({ name: 'activityDetail' })(CompanyInfo);
export default connect(mapStateToProps, mapDispatchToProps)(WrapedCompanyInfo);