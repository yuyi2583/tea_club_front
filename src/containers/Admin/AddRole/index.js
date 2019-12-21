import React from "react";
import { PageHeader, Button, message, Form, Radio, Input, Select, Spin, TreeSelect } from "antd";
import PictureCard from "../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getShop, getShopList } from "../../../redux/modules/shop";
import { actions as clerkActions, getAllPosition, getByAllPosition, getByAuthority, getByBelong } from "../../../redux/modules/clerk";
import { getRequestQuantity } from "../../../redux/modules/app";
import { getTreeData } from "./method";

const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;

class AddRole extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: new Array(),
            redirectToReferrer: false,
        }
    }

    handleBack = () => {
        window.history.back();
    }

    componentDidMount() {
        console.log("this", this);
        this.props.fetchShopList();
        this.props.fetchAllPosition();
        this.props.fetchAllAuthority();
    }

    getExtra = () => {
        const { history, match } = this.props;
        let extra = null;
        if (history.location.pathname.indexOf("role_detail") != -1) {
            extra = (<Button type="primary" onClick={this.startAlterRoleDetail}>修改职员信息</Button>);
        } else {
            extra = null;
        }
        return extra;
    }

    getSubTitle = () => {
        const { history } = this.props;
        let subTitle = null;
        if (history.location.pathname.indexOf("role_detail") != -1) {
            subTitle = "职员详情";
        } else if (history.location.pathname.indexOf("boxInfo") != -1) {
            subTitle = "包厢信息";
        } else if (history.location.pathname.indexOf("addBox") != -1) {
            subTitle = "新增包厢";
        } else if (history.location.pathname.indexOf("clerkDetail") != -1) {
            subTitle = "职员信息";
        } else {
            subTitle = null;
        }
        return subTitle;
    }

    callMessage = (type = "success", content = "操作成功！") => {
        switch (type) {
            case "success":
                message.success(content);
                break;
            case "error":
                message.error(content);
                break;
            case "warning":
                message.warning(content);
                break;
        }
    }

    render() {
        const subTitle = this.getSubTitle();
        const extra = this.getExtra();
        const { match } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 2 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 2 },
                sm: { span: 8 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 8,
                    offset: 8,
                },
                sm: {
                    span: 8,
                    offset: 8,
                },
            },
        };
        const { fileList } = this.state;
        const { requestQuantity, shop, byShopList, allPositions, byAllPositions, byAuthority, byBelong } = this.props;
        const treeData = getTreeData(byBelong, byAuthority);
        return (
            <div>
                <PageHeader
                    title="新增人员"
                    subTitle={subTitle}
                    onBack={this.handleBack}
                    extra={extra}>
                    <Spin spinning={requestQuantity > 0}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                            <Form.Item label="姓名">
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入职员姓名!',
                                        },
                                    ],
                                })(<Input allowClear />)}
                            </Form.Item>
                            <Form.Item label="性别">
                                {getFieldDecorator('sex', {
                                    rules: [
                                        {
                                            required: true,
                                            message: "请选择性别！",
                                        }
                                    ]
                                })(
                                    <Radio.Group>
                                        <Radio value="0">男</Radio>
                                        <Radio value="1">女</Radio>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                            <Form.Item label="联系方式">
                                {getFieldDecorator('contact', {
                                    rules: [{ required: true, message: '请输入联系方式!' }],
                                })(<Input allowClear />)}
                            </Form.Item>
                            <Form.Item label="住址">
                                {getFieldDecorator('address')(<Input.TextArea rows={3} allowClear />)}
                            </Form.Item>
                            <Form.Item label="身份证号">
                                {getFieldDecorator('identityId', {
                                    rules: [{ required: true, message: '请输入身份证号!' }],
                                })(<Input allowClear />)}
                            </Form.Item>
                            <Form.Item label="所属门店">
                                {getFieldDecorator('shop')(
                                    <Select placeholder="请选择门店">
                                        {
                                            shop.shopList != null && shop.shopList.map((item) => (
                                                <Option key={item} value={item}>{byShopList[item].name}</Option>
                                            ))
                                        }
                                    </Select>,
                                )}
                            </Form.Item>
                            <Form.Item label="职位">
                                {getFieldDecorator('position')(
                                    <Select placeholder="请选择职位">
                                        {
                                            allPositions != null && allPositions.map((item) => (
                                                <Option key={item} value={item}>{byAllPositions[item].name}</Option>
                                            ))
                                        }
                                    </Select>,
                                )}
                            </Form.Item>
                            <Form.Item label="权限">
                                {getFieldDecorator('authority')(
                                    <TreeSelect
                                        treeData={treeData}
                                        treeCheckable={true}
                                        showCheckedStrategy={SHOW_PARENT}
                                        searchPlaceholder='请选择权限'
                                        style={{ width: '100%' }}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label="包厢展示">
                                <PictureCard
                                    fileList={fileList}
                                    onChange={this.handleDisplayChange} />
                            </Form.Item>
                            <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit" block loading={requestQuantity > 0}>
                                    注册包厢
                                </Button>
                            </Form.Item>
                        </Form>
                    </Spin>
                </PageHeader>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => {
    return {
        shop: getShop(state),
        byShopList: getShopList(state),
        requestQuantity: getRequestQuantity(state),
        allPositions: getAllPosition(state),
        byAllPositions: getByAllPosition(state),
        byAuthority: getByAuthority(state),
        byBelong: getByBelong(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(clerkActions, dispatch),
        ...bindActionCreators(shopActions, dispatch),
    };
};

const AddRoleForm = Form.create({ name: 'addBox' })(AddRole);
export default connect(mapStateToProps, mapDispatchToProps)(AddRoleForm);