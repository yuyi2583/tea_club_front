import React from "react";
import { Form, Select, TreeSelect, InputNumber } from "antd";
import { activityType, requestType } from "../../utils/common";
import PropTypes from "prop-types";

const { Option } = Select;

class ActivityRuleInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // activityType: "",
        }
    }

    getActivityRuleInput = () => {
        const { index } = this.props;
        console.log("props in rule input", this.props);
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
                    <span>
                        <Form.Item className="inline-input">
                            {getFieldDecorator('activityInReduction1_'+index, {
                                rules: [{ required: true, message: '请输入优惠规则!' }],
                            })(<InputNumber
                                formatter={value => `满 ${value}`}
                                min={0}
                                style={{ width: "100px", marginRight: "10px" }} />)}
                        </Form.Item>
                        <Form.Item className="inline-input">
                            {getFieldDecorator('activityInReduction2_'+index, {
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
                            {getFieldDecorator("activityRuleInDiscount_"+index, {
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

    handleSelectActivityTypeChange = (value) => {
        console.log(value);
        const { index } = this.props;
        if (index == -1) {
            this.setState({ activityType: value });
        } else {
            this.setState({ ["activityType_" + index]: value })
        }

    }

    componentDidMount() {
        const { index } = this.props;
        if (index != -1) {
            this.setState({ ["activityType_" + index]: "" });
        } else {
            this.setState({ activityType: "" });
        }
    }

    render() {
        const activityRuleInput = this.getActivityRuleInput();
        const {getFieldDecorator}=this.props.form;
        const {index}=this.props;
        return (
            <div>
                <Form.Item className="inline-input">
                    {getFieldDecorator('avtivityType_'+index, {
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
                    {getFieldDecorator('avtivityApplyForProduct_'+index, {
                        rules: [{ required: true, message: '请选择优惠产品范围!' }],
                    })(
                        <TreeSelect
                            onFocus={() => this.props.fetchProductType(requestType.modalRequest)}
                            treeDataSimpleMode
                            loading={this.props.requestModalQuantity > 0}
                            style={{ width: '200px' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择优惠产品范围"
                            treeCheckable={true}
                            // onChange={(value) => avtivityApplyForProduct.onChange(value, setFieldsValue)}
                            loadData={(treeNode) => this.props.avtivityApplyForProduct.onLoadData(treeNode, this.props)}
                            treeData={this.props.treeData}
                        />
                    )}
                </Form.Item>
                <Form.Item className="inline-input">
                    {getFieldDecorator('avtivityApplyForCustomer_'+index, {
                        rules: [{ required: true, message: '请选择享受优惠客户范围!' }],
                    })(
                        <Select
                            mode="multiple"
                            loading={this.props.requestModalQuantity > 0}
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
            </div>
        );
    }
}

ActivityRuleInput.propTypes = {
    form: PropTypes.object.isRequired,
    avtivityApplyForProduct: PropTypes.object.isRequired,
    fetchProductType: PropTypes.func.isRequired,
    fetchCustomerType: PropTypes.func.isRequired,
    requestModalQuantity: PropTypes.number.isRequired,
    treeData: PropTypes.array.isRequired,
    customerType: PropTypes.array.isRequired,
    byCustomerType: PropTypes.object.isRequired,
    index: PropTypes.number,
}

ActivityRuleInput.defaultProps = {
    index: -1
}


export default ActivityRuleInput;