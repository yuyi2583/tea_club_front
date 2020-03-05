import React from "react";
import { PageHeader, Button, InputNumber, Form, DatePicker, Input, Select, Spin, TreeSelect, Modal } from "antd";
import PictureCard from "../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getShop, getShopList } from "../../../redux/modules/shop";
import { actions as clerkActions, getAllPosition, getByAllPosition, getByAuthority, getByBelong } from "../../../redux/modules/clerk";
import { actions as productActions, getProductType, getByProductType, getByProductDetail, getProductDetail } from "../../../redux/modules/product";
import { getRequestQuantity, getModalRequestQuantity } from "../../../redux/modules/app";
import { actions as customerActions, getByCustomerType, getCustomerType } from "../../../redux/modules/customer";
import { actions as activityActions, getActivities, getByActivities } from "../../../redux/modules/activity";
import { Redirect } from "react-router-dom";
import { map } from "../../../router";
import { handleBack, callMessage, activityType } from "../../../utils/common";
import "./style.css";
import method from "./utils/method";
import { requestType } from "../../../utils/common";
import common from "./utils/common";
import { MinusCircleOutline, PlusCircleOutline } from '@ant-design/icons';
import ActivityRuleInput from "../../../components/ActivityRuleInput";
import DynamicFieldSet from "../../../components/DynamicFieldSet";;

const { avtivityApplyForProduct } = method;

const { Option } = Select;
const { confirm } = Modal;
const { MonthPicker, RangePicker } = DatePicker;
const { SHOW_PARENT } = TreeSelect;

class AddActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: new Array(),
            from: null,
            activityType: "",
        }
    }

    componentDidMount() {
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
            console.log("values", values);

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
                                    from: map.admin.AdminHome() + `/role/add_role/new_role_detail/${clerkId}`
                                });
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
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { formItemLayout, tailFormItemLayout } = common;
        const { fileList } = this.state;
        const treeData = avtivityApplyForProduct.convertToStandardTreeData(this.props);
        const { requestQuantity, requestModalQuantity, customerType, byCustomerType,
            activities, byActivities } = this.props;
        return (
            <div>
                <PageHeader
                    title="添加活动"
                    onBack={() => handleBack()}>
                    <Spin spinning={requestQuantity > 0}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                            <Form.Item label="活动名称">
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入活动名称!',
                                        },
                                    ],
                                })(<Input allowClear placeholder="请输入活动名称" />)}
                            </Form.Item>
                            <Form.Item label="活动描述">
                                {getFieldDecorator('description', {
                                    rules: [
                                        {
                                            required: true,
                                            message: "请选择活动描述！",
                                        }
                                    ]
                                })(
                                    <Input.TextArea rows={4} allowClear placeholder="请选择活动描述" />
                                )}
                            </Form.Item>
                            <Form.Item label="优惠规则" required>
                                <DynamicFieldSet form={this.props.form} content={"添加优惠规则"}>
                                    <ActivityRuleInput
                                        form={this.props.form}
                                        fetchProductType={this.props.fetchProductType}
                                        avtivityApplyForProduct={avtivityApplyForProduct}
                                        fetchCustomerType={this.props.fetchCustomerType}
                                        requestModalQuantity={requestModalQuantity}
                                        treeData={treeData}
                                        customerType={customerType}
                                        byCustomerType={byCustomerType} />
                                </DynamicFieldSet>
                            </Form.Item>
                            <Form.Item label="活动持续时间">
                                {getFieldDecorator('duration', {
                                    rules: [{ type: 'array', required: true, message: '请选择活动持续时间!' }]
                                })(
                                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                                )}
                            </Form.Item>
                            <Form.Item label="互斥活动">
                                {getFieldDecorator('mutexRange', {
                                    rules: [{ required: true, message: '请选择互斥活动!' }],
                                })(<Select
                                    placeholder="请选择与此活动互斥的互动"
                                    mode="multiple"
                                    loading={requestModalQuantity > 0}
                                    onFocus={() => this.props.fetchActivities(requestType.modalRequest)}
                                >
                                    {
                                        activities.map((uid) => <Option value={uid} key={uid} >{byActivities[uid].name}</Option>)
                                    }
                                </Select>)}
                            </Form.Item>
                            {/* <Form.Item label="活动优先级">
                                {getFieldDecorator('priority', {
                                    rules: [{ required: true, message: '请选择活动优先级!' }],
                                })(
                                    <Select
                                        placeholder="请选择活动优先级"
                                        onChange={this.handleSelectActivityTypeChange}>
                                        <Option value="1">{activityType["1"]}</Option>
                                        <Option value="2">{activityType["2"]}</Option>
                                    </Select>)
                                }
                            </Form.Item> */}
                            <Form.Item label="活动展示照片">
                                <PictureCard
                                    fileList={fileList}
                                    max={4}
                                    onChange={this.handleDisplayChange} />
                            </Form.Item>
                            <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit" block loading={requestQuantity > 0}>
                                    新增活动
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
        allPositions: getAllPosition(state),
        byAllPositions: getByAllPosition(state),
        byAuthority: getByAuthority(state),
        byBelong: getByBelong(state),
        productType: getProductType(state),
        byProductType: getByProductType(state),
        requestQuantity: getRequestQuantity(state),
        requestModalQuantity: getModalRequestQuantity(state),
        productDetail: getProductDetail(state),
        byProductDetail: getByProductDetail(state),
        customerType: getCustomerType(state),
        byCustomerType: getByCustomerType(state),
        activities: getActivities(state),
        byActivities: getByActivities(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(clerkActions, dispatch),
        ...bindActionCreators(shopActions, dispatch),
        ...bindActionCreators(productActions, dispatch),
        ...bindActionCreators(customerActions, dispatch),
        ...bindActionCreators(activityActions, dispatch),
    };
};

const AddActivityForm = Form.create({ name: 'addActivity' })(AddActivity);
export default connect(mapStateToProps, mapDispatchToProps)(AddActivityForm);