import React from "react";
import { Descriptions, Row, Col, Skeleton, Typography, Button, Spin, Input, Select, Empty, Form, DatePicker, Modal } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
    actions as activityActions, getActivities, getByActivities, getByMutexActivities, getByActivityPhotos,
    getByActivityRules, getByActivityApplyForCustomerTypes, getByActivityApplyForProduct, getActivityRuleTypes, getByActivityRuleTypes
} from "../../../../../redux/modules/activity";
import { actions as productActions, getByProductTypes, getProductTypes, getProducts, getByProducts } from "../../../../../redux/modules/product";
import { actions as customerActions, getByCustomerTypes, getCustomerTypes } from "../../../../../redux/modules/customer";
import { Prompt } from "react-router-dom";
import { timeStampConvertToFormatTime, timeStringConvertToTimeStamp } from "../../../../../utils/timeUtil";
import moment from 'moment';
import PictureCard from "../../../../../components/PictureCard";
import ActivityRuleInput from "../../../../../components/ActivityRuleInput";
import DynamicFieldSet from "../../../../../components/DynamicFieldSet";
import { activityStatus } from "../../../../../utils/common";
import { judgeActivityStatus } from "../../../../../utils/commonUtils";

const { RangePicker } = DatePicker;
const { Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const format = 'YYYY-MM-DD HH:mm:ss';
const { confirm } = Modal;

class ActivityDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: new Array(),
        }
    }


    handleSubmit = e => {
        e.preventDefault();
        const { activityId } = this.props.match.params;
        const { fileList } = this.state;;
        const { products, byProducts } = this.props;
        const thiz = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                confirm({
                    title: '确认修改?',
                    content: '输入数据是否无误，确认修改该活动信息',
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
                        activity["uid"] = activityId;
                        activity["mutexActivities"] = values["mutexActivities"] == undefined ? new Array() : values["mutexActivities"];
                        console.log("submit values", activity);
                        thiz.props.updateActivity(activity)
                            .then(() => {
                                thiz.props.callMessage("success", "修改活动成功！");
                                thiz.props.finishAlterInfo();
                            })
                            .catch((err) => {
                                thiz.props.callMessage("error", "修改活动失败！" + err)
                            })
                    },
                });

            }
        });
    };

    componentDidMount() {
        const { activityId } = this.props.match.params;
        this.props.fetchActivity(activityId)
            .then(() => {
                this.setState({ fileList: this.props.byActivities[activityId].photos })
            });;
        this.props.fetchActivityRuleTypes();
        this.props.fetchProductTypes();
        this.props.fetchCustomerTypes();
        this.props.fetchProductsName();
    }

    getInitialDuration = () => {
        let { activityId } = this.props.match.params;
        const { byActivities } = this.props;
        let initialDuration = new Array();
        try {
            initialDuration.push(moment(timeStampConvertToFormatTime(byActivities[activityId].startTime), format));
            initialDuration.push(moment(timeStampConvertToFormatTime(byActivities[activityId].endTime), format));
        } catch{
            initialDuration = new Array();
        }
        return initialDuration;
    }

    getActvityRuleDisplay = () => {
        let { activityId } = this.props.match.params;
        const { byActivities, byActivityRules, byActivityApplyForCustomerTypes, byActivityApplyForProduct } = this.props;
        let display = new Array();
        try {
            display = byActivities[activityId].activityRules.map(uid => {
                let operation = "";
                let currency = "";
                if (byActivityRules[uid].activityRule2 != null) {
                    operation = byActivityRules[uid].activityRule2.operation == "plus" ? "赠" : "减";
                    currency = byActivityRules[uid].activityRule2.currency == "ingot" ? "元宝" : "积分";
                }
                let rule;
                switch (byActivityRules[uid].activityRuleType.name) {
                    case "阅读":
                        rule = `阅读时长满${byActivityRules[uid].activityRule1}分钟
                        ${operation}${byActivityRules[uid].activityRule2.number}${currency}`;
                        break;
                    case "购物":
                        rule = `消费满${byActivityRules[uid].activityRule1}元宝
                        ${operation}${byActivityRules[uid].activityRule2.number}${currency}`;
                        break;
                    case "折扣":
                        rule = `${byActivityRules[uid].activityRule1}%折扣`;
                        break;
                    case "分享产品":
                        rule = `分享${operation}${byActivityRules[uid].activityRule2.number}${currency}`;
                        break;
                    case "充值":
                        rule = `充值满${byActivityRules[uid].activityRule1}元宝
                        ${operation}${byActivityRules[uid].activityRule2.number}${currency}`;
                        break;
                    case "分享文章":
                        rule = `分享${operation}${byActivityRules[uid].activityRule2.number}${currency}`;
                        break;
                    default:
                        rule = "未设置活动规则";
                }
                const product = byActivityRules[uid].activityApplyForProduct.map(uid => <span style={{ margin: "0 5px" }} key={uid}>{byActivityApplyForProduct[uid].name}</span>);
                const customerType = byActivityRules[uid].activityApplyForCustomerTypes.map(uid => <span style={{ margin: "0 5px" }} key={uid}>{byActivityApplyForCustomerTypes[uid].name}</span>);
                return (
                    <Paragraph key={uid}>
                        <strong>活动类型</strong>：{byActivityRules[uid].activityRuleType.name}
                    &nbsp;&nbsp;
                        <strong>规则</strong>：{rule}
                    &nbsp;&nbsp;
                        <strong>适用产品范围</strong>：{byActivityRules[uid].activityRuleType.name == "充值" ? "所有" : product}
                    &nbsp;&nbsp;
                        <strong>适用顾客类型</strong>：{customerType}
                    </Paragraph>
                )
            })
        } catch (err) {
            console.error("get rule err", err);
            display = new Array();
        }
        return display;
    }

    getMutexActivityDisplay = () => {
        let { activityId } = this.props.match.params;
        const { byActivities, byMutexActivities } = this.props;
        let display = <Empty />;
        try {
            display = (
                <Paragraph>
                    {byActivities[activityId].mutexActivities.map(uid => <span style={{ margin: "0 5px" }} key={uid}>{byMutexActivities[uid].name}</span>)}
                </Paragraph>
            )
        } catch{
            display = <Empty />;
        }
        return display;
    }

    getPhotosDisplay = () => {
        const { activityId } = this.props.match.params;
        const { byActivities, byActivityPhotos } = this.props;
        let photoDisplay = new Array();
        try {
            photoDisplay = byActivities[activityId].photos.map((uid) => ({
                uid,
                name: 'image.png',
                status: 'done',
                type: "image/jpeg",
                thumbUrl: `data:image/png;base64,${byActivityPhotos[uid].photo}`,
            }))
        } catch (err) {
            photoDisplay = new Array();
        }
        return photoDisplay;
    }

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

    getActivityStatus = () => {
        const { activityId } = this.props.match.params;
        const { byActivities } = this.props;
        let status = judgeActivityStatus(byActivities[activityId]);
        if (status == null) {
            return;
        }
        return status;
    }

    render() {
        //TODO 活动一旦确立其规则就不能更改
        let { activityId } = this.props.match.params;
        let { activities, byActivities, alterInfo, retrieveRequestQuantity, form, updateRequestQuantity, byActivityRules, customerTypes,
            byCustomerTypes, productTypes, byProductTypes, activityRuleTypes, byActivityRuleTypes, products, byProducts } = this.props;
        const { getFieldDecorator } = form;
        const isDataNull = byActivities[activityId] == undefined || byActivities[activityId] == null;
        const initialDuration = this.getInitialDuration();
        const ruleDisplay = this.getActvityRuleDisplay();
        const mutexActivitiesDisplay = this.getMutexActivityDisplay();
        const photoDisplay = this.getPhotosDisplay();
        const activityStatus = this.getActivityStatus();
        return (
            <div style={{ marginBottom: "20px" }}>
                <Spin spinning={updateRequestQuantity > 0}>
                    {retrieveRequestQuantity > 0 ?
                        <Skeleton active />
                        :
                        <Form onSubmit={this.handleSubmit}>
                            <Descriptions bordered column={2}>
                                <Descriptions.Item label="活动名称">
                                    {
                                        !alterInfo ?
                                            isDataNull ? null : byActivities[activityId].name
                                            : <Form.Item>
                                                {getFieldDecorator('name', {
                                                    rules: [{ required: true, message: '请输入活动名称!' }],
                                                    initialValue: isDataNull ? null : byActivities[activityId].name
                                                })(<Input allowClear name="name" placeholder="请输入活动名称" />)}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="活动持续时间">
                                    {
                                        !alterInfo ?
                                            isDataNull ? null : timeStampConvertToFormatTime(byActivities[activityId].startTime) + " ~ " + timeStampConvertToFormatTime(byActivities[activityId].endTime)
                                            : <Form.Item>
                                                {getFieldDecorator('duration', {
                                                    rules: [{ type: 'array', required: true, message: '请选择活动持续时间!' }],
                                                    initialValue: isDataNull ? null : initialDuration
                                                })(
                                                    <RangePicker showTime format={format} />,
                                                )}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="互斥活动">
                                    {
                                        !alterInfo ?
                                            mutexActivitiesDisplay
                                            : <Form.Item>
                                                {getFieldDecorator('mutexActivities', {
                                                    initialValue: isDataNull ? undefined : byActivities[activityId].mutexActivities
                                                })(<Select
                                                    placeholder="请选择与此活动互斥的互动"
                                                    mode="multiple"
                                                >
                                                    {
                                                        activities.filter(uid => uid != activityId).map((uid) => <Option value={uid} key={uid} >{byActivities[uid].name}</Option>)
                                                    }
                                                </Select>)}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="活动状态">
                                    {activityStatus}
                                </Descriptions.Item>
                                <Descriptions.Item label="活动描述" span={2}>
                                    {
                                        !alterInfo ?
                                            isDataNull ? null : byActivities[activityId].description
                                            : <Form.Item>
                                                {getFieldDecorator('description', {
                                                    rules: [{ required: true, message: "请选择活动描述！" }],
                                                    initialValue: isDataNull ? null : byActivities[activityId].description
                                                })(
                                                    <TextArea rows={4} allowClear placeholder="请选择活动描述" />
                                                )}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="优惠规则" span={2}>
                                    {
                                        !alterInfo ?
                                            ruleDisplay
                                            : <Form.Item required>
                                                <DynamicFieldSet form={this.props.form} content={"添加优惠规则"}
                                                    template={<ActivityRuleInput
                                                        form={this.props.form}
                                                        customerTypes={customerTypes}
                                                        byCustomerTypes={byCustomerTypes}
                                                        productTypes={productTypes}
                                                        byProductTypes={byProductTypes}
                                                        activityRuleTypes={activityRuleTypes}
                                                        byActivityRuleTypes={byActivityRuleTypes}
                                                        products={products}
                                                        byProducts={byProducts}
                                                    />}
                                                >
                                                    {
                                                        byActivities[activityId].activityRules.map(uid =>
                                                            <ActivityRuleInput
                                                                key={uid}
                                                                customerTypes={customerTypes}
                                                                byCustomerTypes={byCustomerTypes}
                                                                productTypes={productTypes}
                                                                byProductTypes={byProductTypes}
                                                                activityRuleTypes={activityRuleTypes}
                                                                byActivityRuleTypes={byActivityRuleTypes}
                                                                products={products}
                                                                byProducts={byProducts}
                                                                activityRule={byActivityRules[uid]}
                                                                form={this.props.form} />
                                                        )
                                                    }
                                                </DynamicFieldSet>
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="活动照片">
                                    {
                                        alterInfo ?
                                            <PictureCard
                                                onChange={this.handleDisplayChange}
                                                fileList={photoDisplay} />
                                            :
                                            <PictureCard
                                                fileList={photoDisplay}
                                                type={"display"} />
                                    }
                                </Descriptions.Item>
                            </Descriptions>
                            {alterInfo &&
                                <Row style={{ margin: "20px 0" }}>
                                    <Col span={12} offset={4}>
                                        <Button type="primary" htmlType="submit" block>确认修改</Button>
                                    </Col>
                                    <Col span={4} push={4}>
                                        <Button block onClick={this.props.finishAlterInfo}>取消修改</Button>
                                    </Col>
                                </Row>
                            }
                        </Form>
                    }
                </Spin>
                <Prompt message="当前页面正在输入中，离开此页面您输入的数据不会被保存，是否离开?" when={alterInfo} />
            </div >
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        activities: getActivities(state),
        byActivities: getByActivities(state),
        byActivityRules: getByActivityRules(state),
        byActivityApplyForProduct: getByActivityApplyForProduct(state),
        byActivityApplyForCustomerTypes: getByActivityApplyForCustomerTypes(state),
        byMutexActivities: getByMutexActivities(state),
        byActivityPhotos: getByActivityPhotos(state),
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
        ...bindActionCreators(activityActions, dispatch),
        ...bindActionCreators(productActions, dispatch),
        ...bindActionCreators(customerActions, dispatch),
    };
};

const WrapedActivityDetail = Form.create({ name: 'activityDetail' })(ActivityDetail);
export default connect(mapStateToProps, mapDispatchToProps)(WrapedActivityDetail);