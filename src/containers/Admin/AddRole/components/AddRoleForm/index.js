import React from "react";
import { PageHeader, Button, message, Form, Radio, Input, Select, Spin, TreeSelect, Modal } from "antd";
import PictureCard from "../../../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getShop, getShopList } from "../../../../../redux/modules/shop";
import { actions as clerkActions, getAllPosition, getByAllPosition, getByAuthority, getByBelong } from "../../../../../redux/modules/clerk";
import { getRetrieveRequestQuantity } from "../../../../../redux/modules/app";
import { getTreeData } from "./method";
import { Redirect } from "react-router-dom";
import { map } from "../../../../../router";

const { Option } = Select;
const { confirm } = Modal;
const { SHOW_PARENT } = TreeSelect;

class AddRole extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: new Array(),
            from: null,
        }
    }

    componentDidMount() {
        console.log("this", this);
        this.props.fetchShopList();
        this.props.fetchAllPosition();
        this.props.fetchAllAuthority();
    }

    handleSubmit = e => {
        e.preventDefault();
        const { fileList } = this.state;;
        const { byAuthority } = this.props;
        const thiz = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                confirm({
                    title: '确认新增?',
                    content: '输入数据是否无误，确认新增该包厢信息',
                    onCancel() {
                    },
                    onOk() {
                        console.log("submit values", values);
                        const { authority } = values;
                        let actualAuthority = new Array();
                        authority != undefined && authority.forEach((item) => {
                            if (item.indexOf("belong") !== -1) {
                                const id = item.split(",")[0];
                                for (var key in byAuthority) {
                                    if (byAuthority[key].belong === id) {
                                        actualAuthority.push(byAuthority[key].uid);
                                    }
                                }
                            } else {
                                const id = item.split(",")[0];
                                actualAuthority.push(id);
                            }
                        });
                        const newClerk = { ...values, authority: actualAuthority, fileList };
                        console.log("actual submit value", newClerk);
                        thiz.props.addClerk(newClerk)
                            .then((clerkId) => {
                                thiz.props.callMessage("success", "新增职员完成！")
                                thiz.setState({
                                    from: map.admin.AdminHome() + `/role/add_role/new_role_detail/${clerkId}`});
                            })
                            .catch((err) => {
                                thiz.props.callMessage("error", "新增职员失败！" + err)
                            })
                    },
                });

            }
        });
    };


    handleDisplayChange = (fileList) => {
        this.setState({ fileList });
    }

    render() {
        const { from } = this.state;
        if (from != null) {
            return <Redirect to={from} />;
        }
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
                        <Form.Item label="照片">
                            <PictureCard
                                fileList={fileList}
                                max={1}
                                onChange={this.handleDisplayChange} />
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" block loading={requestQuantity > 0}>
                                新增人员
                                </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => {
    return {
        shop: getShop(state),
        byShopList: getShopList(state),
        requestQuantity: getRetrieveRequestQuantity(state),
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

const AddRoleForm = Form.create({ name: 'addRole' })(AddRole);
export default connect(mapStateToProps, mapDispatchToProps)(AddRoleForm);