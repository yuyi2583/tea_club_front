import React from "react";
import { PageHeader, Button, InputNumber, Form, DatePicker, Input, Select, Spin, TreeSelect, Modal } from "antd";
import PictureCard from "../../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getShop, getShopList } from "../../../../redux/modules/shop";
import { actions as clerkActions, getAllPosition, getByAllPosition, getByAuthority, getByBelong } from "../../../../redux/modules/clerk";
import { actions as productActions, getProductType, getByProductType } from "../../../../redux/modules/product";
import { getRequestQuantity, getModalRequestQuantity } from "../../../../redux/modules/app";
import { Redirect } from "react-router-dom";
import { map } from "../../../../router";
import { handleBack, callMessage, activityType } from "../../../../utils/common";
import "./style.css";
import DemoTreeSelect from "../../../../Untitled-1";


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

    handleSelectActivityTypeChange = (value) => {
        console.log(value);
        this.setState({ activityType: value });
    }

    getActivityRuleInput = () => {
        const { activityType } = this.state;
        const { getFieldDecorator } = this.props.form;
        switch (activityType) {
            case "1":
                return (
                    <span>
                        <Form.Item className="inline-input">
                            {getFieldDecorator('activityRule1', {
                                rules: [{ required: true, message: '请输入优惠规则!' }],
                            })(<InputNumber
                                formatter={value => `满 ${value}`}
                                min={0}
                                style={{ width: "100px", marginRight: "10px" }} />)}
                        </Form.Item>
                        <Form.Item className="inline-input">
                            {getFieldDecorator('activityRule2', {
                                rules: [{ required: true, message: '请输入优惠规则!' }],
                            })(<InputNumber
                                formatter={value => `减 ${value}`}
                                min={0}
                                allowClear style={{ width: "100px" }} />)}
                        </Form.Item>
                    </span>
                );
            case "2":
                return (
                    <span>
                        <Form.Item className="inline-input">
                            {getFieldDecorator("activityRule2", {
                                rules: [{ required: true, message: "请输入优惠规则!" }],
                                initialValue: 30,
                            })(<InputNumber
                                formatter={value => `${value}%折扣`}
                                min={0}
                                allowClear
                                style={{ width: "100px" }} />
                            )
                            }
                        </Form.Item>
                    </span>
                );
            default:
                return (
                    <span>
                        <Form.Item className="inline-input">
                            <span className="ant-form-text">请选择优惠类型</span>
                        </Form.Item>
                    </span>
                )
        }
    }

    render() {
        const { from } = this.state;
        if (from != null) {
            return <Redirect to={from} />;
        }
        const { getFieldDecorator } = this.props.form;
        const activityRuleInput = this.getActivityRuleInput();
        const formItemLayout = {
            labelCol: {
                xs: { span: 2 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 6 },
                sm: { span: 12 },
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
        const { requestQuantity, productType,byProductType } = this.props;
        // const treeData = getTreeData(byBelong, byAuthority);
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
                                <div>
                                    <Form.Item className="inline-input">
                                        {getFieldDecorator('avtivityType', {
                                            rules: [{ required: true, message: '请选择优惠类型!' }],
                                        })(
                                            <Select
                                                placeholder="请选择优惠类型"
                                                style={{ width: 150 }}
                                                onChange={this.handleSelectActivityTypeChange}>
                                                <Option value="1">{activityType["1"]}</Option>
                                                <Option value="2">{activityType["2"]}</Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                    {activityRuleInput}
                                    <Form.Item className="inline-input">
                                        {getFieldDecorator('avtivityApplyForProduct', {
                                            rules: [{ required: true, message: '请选择优惠产品范围!' }],
                                        })(
                                            <DemoTreeSelect
                                                fetchProductType={this.props.fetchProductType}
                                                requestQuantity={this.props.requestModalQuantity}
                                                productType={productType}
                                                byProductType={byProductType}
                                            />
                                        )}
                                    </Form.Item>
                                    <Form.Item className="inline-input">
                                        {getFieldDecorator('avtivityApplyForConsumer', {
                                            rules: [{ required: true, message: '请选择享受优惠客户范围!' }],
                                        })(
                                            <Select
                                                placeholder="请选择享受优惠客户范围"
                                                style={{ width: 200 }}
                                                onChange={this.handleSelectActivityTypeChange}>
                                                <Option value="1">{activityType["1"]}</Option>
                                                <Option value="2">{activityType["2"]}</Option>
                                            </Select>
                                            // <TreeSelect
                                            //     treeDataSimpleMode
                                            //     style={{ width: '200' }}
                                            //     value={this.state.value}
                                            //     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            //     placeholder="Please select"
                                            //     onChange={this.onChange}
                                            //     loadData={this.onLoadData}
                                            //     treeData={treeData}
                                            // />
                                        )}
                                    </Form.Item>
                                </div>
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
                                    onChange={this.handleSelectActivityTypeChange}>
                                    <Option value="1">{activityType["1"]}</Option>
                                    <Option value="2">{activityType["2"]}</Option>
                                </Select>)}
                            </Form.Item>
                            <Form.Item label="活动优先级">
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
                            </Form.Item>
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
        requestQuantity: getRequestQuantity(state),
        allPositions: getAllPosition(state),
        byAllPositions: getByAllPosition(state),
        byAuthority: getByAuthority(state),
        byBelong: getByBelong(state),
        productType: getProductType(state),
        byProductType: getByProductType(state),
        requestQuantity: getRequestQuantity(state),
        requestModalQuantity: getModalRequestQuantity(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(clerkActions, dispatch),
        ...bindActionCreators(shopActions, dispatch),
        ...bindActionCreators(productActions, dispatch),
    };
};

const AddActivityForm = Form.create({ name: 'addActivity' })(AddActivity);
export default connect(mapStateToProps, mapDispatchToProps)(AddActivityForm);