import React from "react";
import { Form, Select, TreeSelect, InputNumber, Row, Col } from "antd";
import { DynamicFieldSetContext } from "../../components/DynamicFieldSet";
import { activityApplyForProduct } from "./method";
import Price from "../Price";

const { Option } = Select;

let isOriginalRuleType = false;

class ActivityRuleInput extends React.Component {

    getActivityRuleInput = (isUpdate = false) => {
        const index = this.context;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { activityRule } = this.props;
        let activityRuleType = undefined;
        try {
            activityRuleType = getFieldValue("activityRuleType_" + index);
        } catch (err) {
            console.log(err);
            activityRuleType = undefined;
        }
        isOriginalRuleType = isUpdate && activityRule.activityRuleType.uid == activityRuleType;
        switch (activityRuleType) {
            case 5:
                return (
                    <Row>
                        <Col span={12}>
                            <Form.Item className="inline-input">
                                充值满&nbsp;{getFieldDecorator('activityRule1_' + index, {
                                rules: [{ required: true, message: '请输入优惠规则!' }],
                                initialValue: isUpdate ? isOriginalRuleType ? activityRule.activityRule1 : null : null
                            })(<InputNumber
                                min={0}
                                style={{ width: "100px", marginRight: "10px" }} />)}&nbsp;元宝
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item className="inline-input">
                                {getFieldDecorator('activityRule2_' + index, {
                                    rules: [{ required: true, message: '请输入优惠规则!' }],
                                    initialValue: isUpdate ? isOriginalRuleType ? activityRule.activityRule2 : { number: 0, currency: "ingot", operation: "plus" } : { number: 0, currency: "ingot", operation: "plus" }
                                })(<Price showOperation={false} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                )
            case 2:
                return (
                    <Row>
                        <Col span={10}>
                            <Form.Item className="inline-input">
                                消费满&nbsp;{getFieldDecorator('activityRule1_' + index, {
                                rules: [{ required: true, message: '请输入优惠规则!' }],
                                initialValue: isUpdate ? isOriginalRuleType ? activityRule.activityRule1 : null : null
                            })(<InputNumber
                                min={0}
                                style={{ width: "100px", marginRight: "10px" }} />)}元宝
                            </Form.Item>
                        </Col>
                        <Col span={14}>
                            <Form.Item className="inline-input">
                                {getFieldDecorator('activityRule2_' + index, {
                                    rules: [{ required: true, message: '请输入优惠规则!' }],
                                    initialValue: isUpdate ? isOriginalRuleType ? activityRule.activityRule2 : { number: 0, currency: "ingot", operation: "plus" } : { number: 0, currency: "ingot", operation: "plus" }
                                })(<Price />)}
                            </Form.Item>
                        </Col>
                    </Row>
                );
            case 3:
                return (
                    <span>
                        <Form.Item className="inline-input">
                            {getFieldDecorator("activityRule1_" + index, {
                                rules: [{ required: true, message: "请输入优惠规则!" }],
                                initialValue: isUpdate ? isOriginalRuleType ? activityRule.activityRule1 : 30 : 30,
                            })(<InputNumber
                                min={0}
                                allowClear
                                max={100}
                                style={{ width: "100px" }} />
                            )
                            }%折扣
                        </Form.Item>
                    </span>
                );
            case 4:
                return (
                    <span>
                        <Form.Item className="inline-input">
                            {getFieldDecorator("activityRule2_" + index, {
                                rules: [{ required: true, message: "请输入优惠规则!" }],
                                initialValue: isUpdate ? isOriginalRuleType ? activityRule.activityRule2 : { number: 0, currency: "ingot", operation: "plus" } : { number: 0, currency: "ingot", operation: "plus" }
                            })(<Price showOperation={false} />)
                            }
                        </Form.Item>
                    </span>
                );
            case 6:
                return (
                    <span>
                        <Form.Item className="inline-input">
                            {getFieldDecorator("activityRule2_" + index, {
                                rules: [{ required: true, message: "请输入优惠规则!" }],
                                initialValue: isUpdate ? isOriginalRuleType ? activityRule.activityRule2 : { number: 0, currency: "ingot", operation: "plus" } : { number: 0, currency: "ingot", operation: "plus" }
                            })(<Price showOperation={false} />)
                            }
                        </Form.Item>
                    </span>
                );
            case 1:
                return (
                    <Row>
                        <Col span={11}>
                            <Form.Item className="inline-input">
                                阅读时长满&nbsp;{getFieldDecorator('activityRule1_' + index, {
                                rules: [{ required: true, message: '请输入优惠规则!' }],
                                initialValue: isUpdate ? isOriginalRuleType ? activityRule.activityRule1 : null : null
                            })(<InputNumber
                                min={0}
                                style={{ width: "100px", marginRight: "10px" }} />)}秒
                                </Form.Item>
                        </Col>
                        <Col span={13}>
                            <Form.Item className="inline-input">
                                {getFieldDecorator('activityRule2_' + index, {
                                    rules: [{ required: true, message: '请输入优惠规则!' }],
                                    initialValue: isUpdate ? isOriginalRuleType ? activityRule.activityRule2 : { number: 0, currency: "ingot", operation: "plus" } : { number: 0, currency: "ingot", operation: "plus" }
                                })(<Price showOperation={false} />)}
                            </Form.Item>
                        </Col>
                    </Row>
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


    getTreeData = () => {
        const index = this.context
        const { getFieldValue } = this.props.form;
        let activityRuleType = undefined;
        try {
            activityRuleType = getFieldValue("activityRuleType_" + index);
        } catch (err) {
            console.log(err);
            activityRuleType = undefined;
        }
        const { productTypes, byProductTypes, products, byProducts } = this.props;
        // let filterProductTypes = productTypes;
        // let filterProducts = products;
        // if (activityRuleType == 1) {
        //     filterProductTypes = productTypes.filter(uid => byProductTypes[uid].name == "文章");
        //     filterProducts = products.filter(uid => byProducts[uid].type.name == "文章");
        // } else if (activityRuleType != 4) {
        //     filterProductTypes = productTypes.filter(uid => byProductTypes[uid].name != "文章");
        //     filterProducts = products.filter(uid => byProducts[uid].type.name != "文章");
        // }
        return activityApplyForProduct.convertToStandardTreeData(productTypes, byProductTypes, products, byProducts);
    }

    getTreeSelectDisable = () => {
        const index = this.context
        const { getFieldValue } = this.props.form;
        let activityRuleType = undefined;
        try {
            activityRuleType = getFieldValue("activityRuleType_" + index);
        } catch (err) {
            activityRuleType = undefined;
        }
        return activityRuleType == 5 || activityRuleType == 1 || activityRuleType == 6||activityRuleType == 2;
    }

    render() {
        const index = this.context
        const { getFieldDecorator } = this.props.form;
        let isUpdate = false;
        if (this.props.activityRule != null) {
            isUpdate = true;
        }
        const { activityRuleTypes, byActivityRuleTypes, customerTypes, byCustomerTypes, activityRule } = this.props;
        const treeData = this.getTreeData();
        return (
            <div style={{ width: "100%" }}>
                <Row>
                    <Form.Item className="inline-input">
                        {getFieldDecorator('activityRuleType_' + index, {
                            rules: [{ required: true, message: '请选择优惠类型!' }],
                            initialValue: isUpdate ? activityRule.activityRuleType.uid : null
                        })(
                            <Select
                                placeholder="请选择优惠类型"
                                style={{ width: 150 }}>
                                {activityRuleTypes.map(uid => <Option key={uid} value={uid}>{byActivityRuleTypes[uid].name}</Option>)}
                            </Select>
                        )}
                    </Form.Item>
                </Row>
                <Row>
                    {this.getActivityRuleInput(isUpdate)}
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item className="inline-input">
                            {getFieldDecorator('activityApplyForProduct_' + index, {
                                initialValue: isUpdate ? isOriginalRuleType ? activityRule.activityApplyForProduct.map(uid => `product_${uid}`) : null : null
                            })(//TODO 购物时只能选择产品类型
                                <TreeSelect
                                    treeDataSimpleMode
                                    style={{ width: '200px' }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="请选择优惠产品范围"
                                    treeCheckable={true}
                                    disabled={this.getTreeSelectDisable()}
                                    treeData={treeData}
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item className="inline-input">
                            {getFieldDecorator('activityApplyForCustomerTypes_' + index, {
                                rules: [{ required: true, message: '请选择享受优惠客户范围!' }],
                                initialValue: isUpdate ? isOriginalRuleType ? activityRule.activityApplyForCustomerTypes : undefined : undefined
                            })(
                                <Select
                                    mode="multiple"
                                    placeholder="请选择享受优惠客户范围"
                                    style={{ width: 200 }}
                                >
                                    {
                                        customerTypes.map((uid) => <Option value={uid} key={uid}>{byCustomerTypes[uid].name}</Option>)
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </div>
        );
    }
}

ActivityRuleInput.contextType = DynamicFieldSetContext;

export default ActivityRuleInput;