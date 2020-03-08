import React from "react";
import { Descriptions, Row, Col, Skeleton, Typography, Button, Spin, Input, Select, Empty, Form, DatePicker, Modal } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as activityActions, getActivities, getByActivities, getByActivityRules } from "../../../../redux/modules/activity";
import { actions as uiActions, getAlterInfoState } from "../../../../redux/modules/ui";
import { actions as appActions, 
    // getRequestQuantity, getModalRequestQuantity
 } from "../../../../redux/modules/app";
import { actions as productActions, getProductType, getByProductType, getByProductDetail, getProductDetail } from "../../../../redux/modules/product";
import { actions as customerActions, getCustomerType, getByCustomerType } from "../../../../redux/modules/customer";
import { Prompt, Redirect } from "react-router-dom";
import { timeStampConvertToFormatTime, timeStringConvertToTimeStamp } from "../../../../utils/timeUtil";
import moment from 'moment';
import { activityType, requestType } from "../../../../utils/common";
import PictureCard from "../../../../components/PictureCard";
import ActivityRuleInput from "../../../../components/ActivityRuleInput";
import DynamicFieldSet from "../../../../components/DynamicFieldSet";
import { activityApplyForProduct } from "../../../../utils/commonUtils";
import { map } from "../../../../router";

const { RangePicker } = DatePicker;
const { Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { confirm } = Modal;

class ActivityDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: new Array(),
            from: null,
        }
    }

    setFormDefaultValue = () => {
        const { byActivities, match } = this.props;
        const { activityId } = match.params;
        const { getFieldDecorator } = this.props.form;
        let duration = new Array();
        for (let key in byActivities[activityId]) {
            if (key.indexOf("Time") != -1) {
                duration.push(moment(timeStampConvertToFormatTime(byActivities[activityId][key]), dateFormat));
                if (duration.length > 1) {
                    getFieldDecorator("duration", { initialValue: duration });
                }
            }
            getFieldDecorator([key], { initialValue: byActivities[activityId][key] });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.alterInfo != prevProps.alterInfo) {
            this.setFormDefaultValue();
        }
    }

    componentDidMount() {
        this.setFormDefaultValue();
    }

    getFileList = (item) => {
        return item != null || item != undefined ? [{
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: item,
        }] : [];
    }

    componentWillUnmount() {
        this.props.finishAlterInfo();
    }

    getActivityRuleAlterItems = () => {
        let { activityId } = this.props.match.params;
        let { byActivities, byActivityRules } = this.props;
        let contentArray = byActivities[activityId].activityRules.map((rule) => {
            let content = new Object();
            content["activityType"] = byActivityRules[rule].activityType;
            content["activityInReduction1"] = byActivityRules[rule].activityInReduction1;
            content["activityInReduction2"] = byActivityRules[rule].activityInReduction2;
            content["activityRuleInDiscount"] = byActivityRules[rule].activityRuleInDiscount;
            content["activityApplyForProduct"] = byActivityRules[rule].avtivityApplyForProduct;
            content["activityApplyForCustomer"] = byActivityRules[rule].avtivityApplyForCustomer;
            return content;
        });
        return contentArray;
    }

    handleSubmit = e => {
        e.preventDefault();
        const { fileList } = this.state;;
        const { byAuthority } = this.props;
        const thiz = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                confirm({
                    title: '确认修改?',
                    content: '输入数据是否无误，确认修改该活动信息',
                    onCancel() {
                    },
                    onOk() {
                        console.log("submit values", values);
                        const index = values.keys;
                        let activityRules = new Array();
                        let activityInfo = new Object();
                        index.forEach(item => {
                            let rule = new Object();
                            for (let key in values) {
                                let splitKey = key.split("_");
                                if (splitKey.length == 1) {
                                    activityInfo[key] = values[key];
                                    continue;
                                }
                                if (splitKey[1].indexOf(item) != -1) {
                                    rule[splitKey[0]] = values[key];
                                    // delete values[key];
                                }
                            }
                            activityRules.push(rule);
                        })
                        activityInfo["activityRules"] = activityRules;
                        activityInfo["startTime"] = timeStringConvertToTimeStamp(values["duration"][0].format("YYYY-MM-DD HH:mm:ss"));
                        activityInfo["endTime"] = timeStringConvertToTimeStamp(values["duration"][1].format("YYYY-MM-DD HH:mm:ss"));
                        console.log("actual submit value", activityInfo);
                        thiz.props.alterActivityInfo(activityInfo)
                            .then(() => {
                                this.props.callMessage("success", "修改活动成功！")
                                thiz.setState({
                                    from: map.admin.AdminHome() + `/activity_management/activities`
                                });
                            })
                            .catch((err) => {
                                this.props.callMessage("error", "修改活动失败！" + err)
                            })
                    },
                });

            }
        });
    };

    // forDisplay = () => {
    //     const { shopInfo } = this.props.shop;
    //     if (shopInfo === null) {
    //         return {
    //             fileListInProps: new Array(),
    //             fileListInState: new Array()
    //         };
    //     }
    //     const { byDisplay } = this.props;
    //     const fileListInProps = shopInfo.display.map((displayId) => byDisplay[displayId]);
    //     const shopInfoInState = this.state.shopInfo;
    //     const fileListInState = shopInfoInState.display.map((displayId) => byDisplay[displayId]);
    //     return {
    //         fileListInProps,
    //         fileListInState
    //     };
    // }

    render() {
        const { from } = this.state;
        if (from != null) {
            return <Redirect to={from} />;
        }
        let { activityId } = this.props.match.params;
        let { activities, byActivities, alterInfo, requestQuantity, form, modalRequestQuantity,
            byActivityRules, productType, byProductType, customerType, byCustomerType } = this.props;
        const fileListInProps = this.getFileList(byActivities[activityId].pictures);
        const fileListInState = this.getFileList(this.state.pictures);
        const { getFieldDecorator } = form;
        const treeData = activityApplyForProduct.convertToStandardTreeData(this.props);
        const contentArray = this.getActivityRuleAlterItems();
        const { fileList } = this.state;
        // const { fileListInProps, fileListInState } = this.forDisplay();
        return (
            <div>
                <Spin spinning={requestQuantity > 0}>
                    <Form onSubmit={this.handleSubmit}>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="活动名称">
                                {requestQuantity > 0 ?
                                    <Skeleton active /> :
                                    !alterInfo ?
                                        byActivities[activityId].name
                                        : <Form.Item>
                                            {getFieldDecorator('name', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入活动名称!',
                                                    },
                                                ],
                                            })(<Input allowClear name="name" placeholder="请输入活动名称" />)}
                                        </Form.Item>
                                }
                            </Descriptions.Item>
                            <Descriptions.Item >
                                {requestQuantity > 0 ?
                                    <Skeleton active /> :
                                    !alterInfo ?
                                        timeStampConvertToFormatTime(byActivities[activityId].startTime) + " ~ " + timeStampConvertToFormatTime(byActivities[activityId].endTime)
                                        : <Form.Item>
                                            {getFieldDecorator('duration', {
                                                rules: [{ type: 'array', required: true, message: '请选择活动持续时间!' }]
                                            })(
                                                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                                            )}
                                        </Form.Item>
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="活动描述" span={2}>
                                {requestQuantity > 0 ?
                                    <Skeleton active /> :
                                    !alterInfo ?
                                        byActivities[activityId].description
                                        : <Form.Item>
                                            {getFieldDecorator('description', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: "请选择活动描述！",
                                                    }
                                                ]
                                            })(
                                                <TextArea rows={4} allowClear placeholder="请选择活动描述" />
                                            )}
                                        </Form.Item>
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="优惠规则" span={2}>
                                {requestQuantity > 0 ?
                                    <Skeleton active /> :
                                    !alterInfo ?
                                        byActivities[activityId].activityRules.map((rule) => {
                                            return <Paragraph key={rule}>
                                                活动类型：{activityType[byActivityRules[rule].activityType]}
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                        <span style={{ textDecoration: "underline" }}>
                                                    {
                                                        byActivityRules[rule].activityType == "1" ? "满" + byActivityRules[rule].activityInReduction1 + "元减" + byActivityRules[rule].activityInReduction2 + "元" :
                                                            byActivityRules[rule].activityRuleInDiscount + "%折扣"
                                                    }
                                                </span>
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                        优惠产品范围：{byActivityRules[rule].avtivityApplyForProduct.map(item => {
                                                    console.log("byProductType[item]", byProductType[item]);

                                                    return <span key={item}>{byProductType[item].type}  </span>
                                                })}
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                        优惠客户范围：{byActivityRules[rule].avtivityApplyForCustomer.map(item => <span key={item}>{byCustomerType[item].name}  </span>)}
                                            </Paragraph>
                                        })
                                        : <Form.Item required>
                                            <DynamicFieldSet form={this.props.form} content={"添加优惠规则"}
                                                template={<ActivityRuleInput
                                                    form={this.props.form}
                                                    fetchProductType={this.props.fetchProductType}
                                                    activityApplyForProduct={activityApplyForProduct}
                                                    fetchCustomerType={this.props.fetchCustomerType}
                                                    modalRequestQuantity={modalRequestQuantity}
                                                    treeData={treeData}
                                                    customerType={customerType}
                                                    byCustomerType={byCustomerType} />}
                                            >
                                                {
                                                    contentArray.map((content, index) => {
                                                        return <div key={index}>
                                                            <ActivityRuleInput
                                                                form={this.props.form}
                                                                content={content}
                                                                fetchProductType={this.props.fetchProductType}
                                                                activityApplyForProduct={activityApplyForProduct}
                                                                fetchCustomerType={this.props.fetchCustomerType}
                                                                modalRequestQuantity={modalRequestQuantity}
                                                                treeData={treeData}
                                                                customerType={customerType}
                                                                byCustomerType={byCustomerType} />
                                                        </div>
                                                    })
                                                }
                                            </DynamicFieldSet>
                                        </Form.Item>
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="互斥活动" span={2}>
                                {requestQuantity > 0 ?
                                    <Skeleton active /> :
                                    !alterInfo ?
                                        <ol>
                                            {byActivities[activityId].mutexRange.map(item => <li key={item}>{byActivities[item].name}</li>)}
                                        </ol>
                                        : <Form.Item>
                                            {getFieldDecorator('mutexRange', {
                                                rules: [{ required: true, message: '请选择互斥活动!' }],
                                            })(<Select
                                                placeholder="请选择与此活动互斥的互动"
                                                mode="multiple"
                                                loading={modalRequestQuantity > 0}
                                                onFocus={() => this.props.fetchActivities(requestType.modalRequest)}
                                            >
                                                {
                                                    activities.map((uid) => <Option value={uid} key={uid} >{byActivities[uid].name}</Option>)
                                                }
                                            </Select>)}
                                        </Form.Item>
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="照片">
                                {requestQuantity > 0 ?
                                    <Skeleton active /> :
                                    alterInfo ?
                                        <PictureCard
                                            fileList={fileListInState}
                                            alterInfo={alterInfo}
                                            p="state"
                                            onChange={this.fileListOnChange} />
                                        : byActivities[activityId].pictures == null || byActivities[activityId].pictures == undefined ?
                                            <Empty />
                                            : <PictureCard
                                                fileList={fileListInProps}
                                                p="props"
                                                alterInfo={alterInfo}
                                                onChange={this.fileListOnChange} />
                                }
                            </Descriptions.Item>
                        </Descriptions>
                        {alterInfo &&
                            <Row style={{ margin: "20px 0" }}>
                                <Col span={12} offset={4}>
                                    <Button type="primary" htmlType="submit" block loading={requestQuantity > 0}>确认修改</Button>
                                </Col>
                                <Col span={4} push={4}>
                                    <Button block onClick={() => {
                                        this.props.finishAlterInfo()
                                        console.log("field value after alter", this.props.form.getFieldsValue());
                                    }}>取消修改</Button>
                                </Col>
                            </Row>
                        }
                    </Form>
                </Spin>
                <Prompt message="当前页面正在输入中，离开此页面您输入的数据不会被保存，是否离开?" when={alterInfo} />
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        activities: getActivities(state),
        byActivities: getByActivities(state),
        alterInfo: getAlterInfoState(state),
        // requestQuantity: getRequestQuantity(state),
        byActivityRules: getByActivityRules(state),
        // modalRequestQuantity: getModalRequestQuantity(state),
        productType: getProductType(state),
        byProductType: getByProductType(state),
        productDetail: getProductDetail(state),
        byProductDetail: getByProductDetail(state),
        customerType: getCustomerType(state),
        byCustomerType: getByCustomerType(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(activityActions, dispatch),
        ...bindActionCreators(uiActions, dispatch),
        ...bindActionCreators(appActions, dispatch),
        ...bindActionCreators(productActions, dispatch),
        ...bindActionCreators(customerActions, dispatch),
    };
};

const WrapedActivityDetail = Form.create({ name: 'activityDetail' })(ActivityDetail);
export default connect(mapStateToProps, mapDispatchToProps)(WrapedActivityDetail);