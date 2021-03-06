import React from "react";
import { PageHeader, Button, Form, DatePicker, Input, Select, Radio, Spin, Modal,Tooltip,Icon } from "antd";
import PictureCard from "../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as activityActions, getActivities, getByActivities, getActivityRuleTypes, getByActivityRuleTypes } from "../../../redux/modules/activity";
import { actions as customerActions, getByCustomerTypes, getCustomerTypes } from "../../../redux/modules/customer";
import { actions as productActions, getByProductTypes, getProductTypes, getProducts, getByProducts } from "../../../redux/modules/product";
import { Redirect,Prompt } from "react-router-dom";
import { map } from "../../../router";
import "./style.css";
import ActivityRuleInput from "../../../components/ActivityRuleInput";
import DynamicFieldSet from "../../../components/DynamicFieldSet";
import { timeStringConvertToTimeStamp } from "../../../utils/timeUtil";
import { formItemLayout, tailFormItemLayout } from "../../../utils/common";


const { Option } = Select;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

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
        this.props.fetchActivitiesNameDesc().catch(err => this.props.callMessage("error", err));
        this.props.fetchActivityRuleTypes().catch(err => this.props.callMessage("error", err));
        this.props.fetchProductTypes().catch(err => this.props.callMessage("error", err));
        this.props.fetchCustomerTypes().catch(err => this.props.callMessage("error", err));
        this.props.fetchProductsName().catch(err => this.props.callMessage("error", err));
    }

    //TODO 优先级设置
    handleSubmit = e => {
        e.preventDefault();
        const { fileList } = this.state;;
        const thiz = this;
        const { byProducts, products } = this.props;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                confirm({
                    title: '确认新增?',
                    content: '输入数据是否无误，确认新增该活动信息',
                    onCancel() {
                    },
                    onOk() {
                        console.log("values", values);
                        const index = values.keys;
                        let activityRules = new Array();
                        let activity = new Object();
                        index.forEach(item => {
                            let rule = new Object();
                            for (let key in values) {
                                let splitKey = key.split("_");
                                if (splitKey.length == 1) {
                                    activity[key] = values[key];
                                    continue;
                                }
                                if (splitKey[1].indexOf(item) != -1) {
                                    if (splitKey[0] == "activityApplyForProduct") {
                                        let activityApplyForProduct = new Array();
                                        try {
                                            values[key].forEach(item => {
                                                if (item.indexOf("type") != -1) {//表示某一类型产品全选，将其转化为该类型下所有产品id
                                                    let productsUid = new Array();
                                                    try {
                                                        productsUid = products.filter(uid => byProducts[uid].type.uid == parseInt(item.split("_")[1]));
                                                    } catch{
                                                        productsUid = new Array();
                                                    }
                                                    activityApplyForProduct = activityApplyForProduct.concat(productsUid);
                                                } else {
                                                    activityApplyForProduct.push(parseInt(item.split("_")[1]));
                                                }
                                            })
                                        } catch{
                                            activityApplyForProduct = new Array();
                                        }
                                        rule[splitKey[0]] = activityApplyForProduct;
                                    } else {
                                        rule[splitKey[0]] = values[key];
                                    }
                                }
                            }
                            activityRules.push(rule);
                        })
                        activity["activityRules"] = activityRules;
                        activity["startTime"] = timeStringConvertToTimeStamp(values["duration"][0].format("YYYY-MM-DD HH:mm:ss"));
                        activity["endTime"] = timeStringConvertToTimeStamp(values["duration"][1].format("YYYY-MM-DD HH:mm:ss"));
                        activity["photos"] = fileList;
                        activity["mutexActivities"] = values["mutexActivities"] == undefined ? new Array() : values["mutexActivities"];
                        console.log("submit values", activity);
                        thiz.props.addActivity(activity)
                            .then(() => {
                                thiz.props.callMessage("success", "新增活动成功！")
                                thiz.setState({
                                    from: map.admin.AdminHome() + `/activity_management/activities`
                                });
                            })
                            .catch((err) => {
                                thiz.props.callMessage("error", "新增活动失败！" + err)
                            })
                    },
                });

            }
        });
    };


    handleDisplayChange = (type, data) => {
        const { fileList } = this.state;
        switch (type) {
            case "done":
                console.log("add shop photo", data);
                if (fileList.indexOf(data.uid) == -1) {
                    this.setState({ fileList: fileList.concat([data.uid]) });
                }
                break;
            case "removed":
                console.log("remove shop photo", data);
                let newFileList = fileList.filter(uid => uid != data.uid);
                this.setState({ fileList: newFileList });
                break;
        }
    }
    //TODO 购物优惠规则无rule1待更改
    render() {
        const { from } = this.state;
        if (from != null) {
            return <Redirect to={from} />;
        }
        const { getFieldDecorator } = this.props.form;
        const { retrieveRequestQuantity, activities, byActivities, customerTypes,
            byCustomerTypes, productTypes, byProductTypes, activityRuleTypes, byActivityRuleTypes, products, byProducts } = this.props;
        return (
            <div>
                <PageHeader
                    title="添加活动"
                    onBack={this.props.handleBack}>
                    <Spin spinning={retrieveRequestQuantity > 0}>
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
                                <DynamicFieldSet form={this.props.form} content={"添加优惠规则"}
                                    template={<ActivityRuleInput
                                        customerTypes={customerTypes}
                                        byCustomerTypes={byCustomerTypes}
                                        productTypes={productTypes}
                                        byProductTypes={byProductTypes}
                                        activityRuleTypes={activityRuleTypes}
                                        byActivityRuleTypes={byActivityRuleTypes}
                                        products={products}
                                        byProducts={byProducts}
                                        form={this.props.form} />}
                                />
                            </Form.Item>
                            <Form.Item label="活动持续时间">
                                {getFieldDecorator('duration', {
                                    rules: [{ type: 'array', required: true, message: '请选择活动持续时间!' }]
                                })(
                                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                                )}
                            </Form.Item>
                            <Form.Item label="是否在首页展示">
                                {getFieldDecorator('showOnHome', {
                                    rules: [{ required: true, message: '请选择是否在首页展示!' }],
                                    initialValue: false
                                })(<Radio.Group>
                                    <Radio value={false}>否</Radio>
                                    <Radio value={true}>是</Radio>
                                </Radio.Group>)}
                            </Form.Item>
                            <Form.Item label={
                                <span>
                                    优先级&nbsp;
                                     <Tooltip title="数字越小优先级越高">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>
                            }>
                                {getFieldDecorator('priority', {
                                    rules: [{ required: true, message: '请选择活动优先级' }],
                                    initialValue: false
                                })(<Select
                                    placeholder="请选择活动优先级">
                                    {
                                        [1,2,3,4,5].map((item) => <Option value={item} key={item} >{item}</Option>)
                                    }
                                </Select>)}
                            </Form.Item>
                            <Form.Item label="互斥活动">
                                {getFieldDecorator('mutexActivities')
                                    (<Select
                                        placeholder="请选择与此活动互斥的互动"
                                        mode="multiple">
                                        {
                                            activities.map((uid) => <Option value={uid} key={uid} >{byActivities[uid].name}</Option>)
                                        }
                                    </Select>)}
                            </Form.Item>
                            <Form.Item label="活动展示照片">
                                <PictureCard onChange={this.handleDisplayChange} />
                            </Form.Item>
                            <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit" block>
                                    新增活动
                                </Button>
                            </Form.Item>
                        </Form>
                    </Spin>
                </PageHeader>
                <Prompt message="当前页面正在输入中，离开此页面您输入的数据不会被保存，是否离开?" when={true} />
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        activities: getActivities(state),
        byActivities: getByActivities(state),
        customerTypes: getCustomerTypes(state),
        byCustomerTypes: getByCustomerTypes(state),
        productTypes: getProductTypes(state),
        byProductTypes: getByProductTypes(state),
        activityRuleTypes: getActivityRuleTypes(state),
        byActivityRuleTypes: getByActivityRuleTypes(state),
        products: getProducts(state),
        byProducts: getByProducts(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(productActions, dispatch),
        ...bindActionCreators(customerActions, dispatch),
        ...bindActionCreators(activityActions, dispatch),
    };
};

const AddActivityForm = Form.create({ name: 'addActivity' })(AddActivity);
export default connect(mapStateToProps, mapDispatchToProps)(AddActivityForm);