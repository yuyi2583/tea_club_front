import React from "react";
import { Form, Select, TreeSelect, InputNumber, Row, Col } from "antd";
import { activityType, requestType } from "../../utils/common";
import PropTypes from "prop-types";
import { DynamicFieldSetContext } from "../../components/DynamicFieldSet";

const { Option } = Select;

class ActivityRuleInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    getActivityRuleInput = () => {
        const index = this.context;
        let activityType;
        if (index == -1) {
            activityType = this.state.activityType;
        } else {
            activityType = this.state["activityType_" + index]
        }

        const { getFieldDecorator } = this.props.form;
        switch (activityType) {
            case "1":
                return (
                    <Row>
                        <Col span={12}>
                            <Form.Item className="inline-input">
                                {getFieldDecorator('activityInReduction1_' + index, {
                                    rules: [{ required: true, message: '请输入优惠规则!' }],
                                })(<InputNumber
                                    formatter={value => `满 ${value}`}
                                    min={0}
                                    style={{ width: "100px", marginRight: "10px" }} />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item className="inline-input">
                                {getFieldDecorator('activityInReduction2_' + index, {
                                    rules: [{ required: true, message: '请输入优惠规则!' }],
                                })(<InputNumber
                                    formatter={value => `减 ${value}`}
                                    min={0}
                                    allowClear style={{ width: "100px" }} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                );
            case "2":
                return (
                    <span>
                        <Form.Item className="inline-input">
                            {getFieldDecorator("activityRuleInDiscount_" + index, {
                                rules: [{ required: true, message: "请输入优惠规则!" }],
                                initialValue: 30,
                            })(<InputNumber
                                formatter={value => `${value}%折扣`}
                                min={0}
                                allowClear
                                max={100}
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

    handleSelectActivityTypeChange = (value) => {
        const index = this.context
        if (index == -1) {
            this.setState({ activityType: value });
        } else {
            this.setState({ ["activityType_" + index]: value })
        }
        console.log("new field value", this.props.form.getFieldsValue());

    }

    componentDidMount() {
        const index = this.context
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const { content } = this.props;
        if (content != null) {
            for (let key in content) {
                getFieldDecorator([key + "_" + index], { initialValue: content[key] });
                if (key.indexOf("activityType") != -1) {
                    if (index != -1) {
                        this.setState({ ["activityType_" + index]: content[key] });
                    } else {
                        this.setState({ activityType: content[key] });
                    }
                }
            }
        }
        console.log("field value", getFieldsValue());

    }

    render() {
        const activityRuleInput = this.getActivityRuleInput();
        const { getFieldDecorator } = this.props.form;
        const index = this.context;
        return (
            <div>
                <Row>
                    <Col span={12}>
                        <Form.Item className="inline-input">
                            {getFieldDecorator('activityType_' + index, {
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
                    </Col>
                    <Col span={12}>
                        {activityRuleInput}
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item className="inline-input">
                            {getFieldDecorator('activityApplyForProduct_' + index, {
                                rules: [{ required: true, message: '请选择优惠产品范围!' }],
                            })(
                                <TreeSelect
                                    onFocus={() => this.props.fetchProductType(requestType.modalRequest)}
                                    treeDataSimpleMode
                                    loading={this.props.modalRequestQuantity > 0}
                                    style={{ width: '200px' }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="请选择优惠产品范围"
                                    treeCheckable={true}
                                    // onChange={(value) => activityApplyForProduct.onChange(value, setFieldsValue)}
                                    loadData={(treeNode) => this.props.activityApplyForProduct.onLoadData(treeNode, this.props)}
                                    treeData={this.props.treeData}
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item className="inline-input">
                            {getFieldDecorator('activityApplyForCustomer_' + index, {
                                rules: [{ required: true, message: '请选择享受优惠客户范围!' }],
                            })(
                                <Select
                                    mode="multiple"
                                    loading={this.props.modalRequestQuantity > 0}
                                    placeholder="请选择享受优惠客户范围"
                                    onFocus={() => this.props.fetchCustomerType(requestType.modalRequest)}
                                    style={{ width: 200 }}
                                // onChange={this.handleSelectActivityTypeChange}
                                >
                                    {
                                        this.props.customerType.map((uid) => <Option value={uid} key={uid}>{this.props.byCustomerType[uid].name}</Option>)
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

ActivityRuleInput.propTypes = {
    content: PropTypes.shape({
        activityType: PropTypes.string,
        activityInReduction1: PropTypes.number,
        activityInReduction2: PropTypes.number,
        activityApplyForProduct: PropTypes.array,
        activityApplyForCustomer: PropTypes.array,
        activityRuleInDiscount: PropTypes.number
    }),
    form: PropTypes.object.isRequired,
    activityApplyForProduct: PropTypes.object.isRequired,
    fetchProductType: PropTypes.func.isRequired,
    fetchCustomerType: PropTypes.func.isRequired,
    modalRequestQuantity: PropTypes.number.isRequired,
    treeData: PropTypes.array.isRequired,
    customerType: PropTypes.array.isRequired,
    byCustomerType: PropTypes.object.isRequired,
    index: PropTypes.number,
}

ActivityRuleInput.defaultProps = {
    index: -1,
    content: null,
}


export default ActivityRuleInput;