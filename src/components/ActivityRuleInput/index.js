import React from "react";
import { Form, Select, TreeSelect, InputNumber, Row, Col } from "antd";
import { activityType, requestType } from "../../utils/common";
import PropTypes from "prop-types";
import { DynamicFieldSetContext } from "../../components/DynamicFieldSet";
import { actions as customerActions, getByCustomerTypes, getCustomerTypes } from "../../redux/modules/customer";
import { actions as productActions, getByProductTypes, getProductTypes, getProducts, getByProducts } from "../../redux/modules/product";
import { actions as activityActions, getActivityRuleTypes, getByActivityRuleTypes } from "../../redux/modules/activity";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { activityApplyForProduct } from "./method";
import Price from "../Price";

const { Option } = Select;

class ActivityRuleInput extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {}
    // }

    getActivityRuleInput = () => {
        const index = this.context;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        let activityRuleType = undefined;
        try {
            activityRuleType = getFieldValue("activityRuleType_" + index);
        } catch (err) {
            console.log(err);
            activityRuleType = undefined;
        }
        switch (activityRuleType) {
            case 5:
                return (
                    <Row>
                        <Col span={12}>
                            <Form.Item className="inline-input">
                                充值满&nbsp;{getFieldDecorator('activityRule1_' + index, {
                                rules: [{ required: true, message: '请输入优惠规则!' }],
                            })(<InputNumber
                                min={0}
                                style={{ width: "100px", marginRight: "10px" }} />)}&nbsp;元宝
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item className="inline-input">
                                {getFieldDecorator('activityRule2_' + index, {
                                    rules: [{ required: true, message: '请输入优惠规则!' }],
                                    initialValue:{number:0,currency:"ingot",operation:"plus"}
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
                            })(<InputNumber
                                min={0}
                                style={{ width: "100px", marginRight: "10px" }} />)}元宝
                            </Form.Item>
                        </Col>
                        <Col span={14}>
                            <Form.Item className="inline-input">
                                {getFieldDecorator('activityRule2_' + index, {
                                    rules: [{ required: true, message: '请输入优惠规则!' }],
                                    initialValue:{number:0,currency:"ingot",operation:"plus"}
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
                                initialValue: 30,
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
                            {getFieldDecorator("activityRule1_" + index, {
                            rules: [{ required: true, message: "请输入优惠规则!" }],
                            initialValue:{number:0,currency:"ingot",operation:"plus"}
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
                            })(<InputNumber
                                min={0}
                                style={{ width: "100px", marginRight: "10px" }} />)}分钟
                                </Form.Item>
                        </Col>
                        <Col span={13}>
                            <Form.Item className="inline-input">
                                {getFieldDecorator('activityRule2_' + index, {
                                rules: [{ required: true, message: '请输入优惠规则!' }],
                                initialValue:{number:0,currency:"ingot",operation:"plus"}
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

    componentDidMount() {
        this.props.fetchActivityRuleTypes();
        this.props.fetchProductTypes();
        this.props.fetchCustomerTypes();
        this.props.fetchProductsName();
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
        let filterProductTypes = productTypes;
        let filterProducts = products;
        if (activityRuleType == 1) {
            filterProductTypes = productTypes.filter(uid => byProductTypes[uid].name == "文章");
            filterProducts = products.filter(uid => byProducts[uid].type.name == "文章");
        } else if (activityRuleType != 4) {
            filterProductTypes = productTypes.filter(uid => byProductTypes[uid].name != "文章");
            filterProducts = products.filter(uid => byProducts[uid].type.name != "文章");
        }
        return activityApplyForProduct.convertToStandardTreeData(filterProductTypes, byProductTypes, filterProducts, byProducts);
    }

    render() {
        const index = this.context
        const activityRuleInput = this.getActivityRuleInput();
        const { getFieldDecorator, getFieldValue } = this.props.form;
        let activityRuleType = undefined;
        try {
            activityRuleType = getFieldValue("activityRuleType_" + index);
        } catch (err) {
            activityRuleType = undefined;
        }
        const { activityRuleTypes, byActivityRuleTypes,  customerTypes, byCustomerTypes } = this.props;
        const treeData = this.getTreeData();
        return (
            <div style={{ width: "100%" }}>
                <Row>
                    <Form.Item className="inline-input">
                        {getFieldDecorator('activityRuleType_' + index, {
                            rules: [{ required: true, message: '请选择优惠类型!' }],
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
                    {activityRuleInput}
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item className="inline-input">
                            {getFieldDecorator('activityApplyForProduct_' + index)(
                                <TreeSelect
                                    treeDataSimpleMode
                                    style={{ width: '200px' }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="请选择优惠产品范围"
                                    treeCheckable={true}
                                    disabled={activityRuleType == 5}
                                    // loadData={(treeNode) => activityApplyForProduct.onLoadData(treeNode, this.props)}
                                    treeData={treeData}
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item className="inline-input">
                            {getFieldDecorator('activityApplyForCustomerTypes_' + index, {
                                rules: [{ required: true, message: '请选择享受优惠客户范围!' }],
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

// ActivityRuleInput.propTypes = {
//     content: PropTypes.shape({
//         activityType: PropTypes.string,
//         activityInReduction1: PropTypes.number,
//         activityInReduction2: PropTypes.number,
//         activityApplyForProduct: PropTypes.array,
//         activityApplyForCustomer: PropTypes.array,
//         activityRuleInDiscount: PropTypes.number
//     }),
//     form: PropTypes.object.isRequired,
//     activityApplyForProduct: PropTypes.object.isRequired,
//     fetchProductType: PropTypes.func.isRequired,
//     fetchCustomerType: PropTypes.func.isRequired,
//     modalRequestQuantity: PropTypes.number.isRequired,
//     treeData: PropTypes.array.isRequired,
//     customerType: PropTypes.array.isRequired,
//     byCustomerType: PropTypes.object.isRequired,
//     index: PropTypes.number,
// }

// ActivityRuleInput.defaultProps = {
//     index: -1,
//     content: null,
// }


const mapStateToProps = (state, props) => {
    return {
        customerTypes: getCustomerTypes(state),
        byCustomerTypes: getByCustomerTypes(state),
        productTypes: getProductTypes(state),
        byProductTypes: getByProductTypes(state),
        activityRuleTypes: getActivityRuleTypes(state),
        byActivityRuleTypes: getByActivityRuleTypes(state),
        products: getProducts(state),
        byProducts: getByProducts(state),
        // shop: getShop(state),
        // byShopList: getShopList(state),
        // byAuthority: getByAuthority(state),
        // byBelong: getByBelong(state),
        // // requestQuantity: getRetrieveRequestQuantity(state),
        // // modalRequestQuantity: getModalRequestQuantity(state),
        // productDetail: getProductDetail(state),
        // byProductDetail: getByProductDetail(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(productActions, dispatch),
        ...bindActionCreators(customerActions, dispatch),
        ...bindActionCreators(activityActions, dispatch),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(ActivityRuleInput);