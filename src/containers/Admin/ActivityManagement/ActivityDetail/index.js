import React from "react";
import { Descriptions, Tree, Icon, Row, Col, Skeleton, Typography, Button, Spin, Input, Select, Empty, Form, DatePicker } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as activityActions, getActivities, getByActivities, getByActivityRules } from "../../../../redux/modules/activity";
import { actions as uiActions, getAlterInfoState } from "../../../../redux/modules/ui";
import { actions as appActions, getRequestQuantity } from "../../../../redux/modules/app";
// import { actions as productActions, getProductType, getByProductType } from "../../../../redux/modules/product";
// import { actions as customerActions, getCustomerType, getByCustomerType } from "../../../../redux/modules/customer";
import { Prompt } from "react-router-dom";
import { timeStampConvertToFormatTime } from "../../../../utils/timeUtil";
import moment from 'moment';
import { activityType } from "../../../../utils/common";
import PictureCard from "../../../../components/PictureCard";
import ActivityRuleInput from "../../../../components/ActivityRuleInput";

const { MonthPicker, RangePicker } = DatePicker;
const { Paragraph } = Typography;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class ActivityDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // validateStatus: {
            //     name: "success",
            //     contact: "success",
            //     identityId: "success",
            //     address: "success",
            // }
        }
    }

    // componentWillMount() {
    //     this.props.fetchProductType();
    //     this.props.fetchCustomerType();
    // }

    componentDidMount() {
        const { byActivities, match } = this.props;
        const { activityId } = match.params;
        this.setState({ ...byActivities[activityId] });
        let validateStatus = new Object();
        for (let key in byActivities[activityId]) {
            validateStatus[key] = "success";
        }
        this.setState({ validateStatus });
    }

    getFileList = (item) => {
        return item != null || item != undefined ? [{
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: item,
        }] : [];
    }

    render() {
        let { activityId } = this.props.match.params;
        let { activities, byActivities, alterInfo, requestQuantity,
            byActivityRules, productType, byProductType, customerType, byCustomerType } = this.props;
        let { validateStatus } = this.state;
        const fileListInProps = this.getFileList(byActivities[activityId].pictures);
        const fileListInState = this.getFileList(this.state.pictures);
        return (
            <div>
                <Spin spinning={requestQuantity > 0}>
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="活动名称">
                            {requestQuantity > 0 ?
                                <Skeleton active /> :
                                !alterInfo ?
                                    byActivities[activityId].name
                                    : <Form.Item
                                        validateStatus={validateStatus.name}
                                        help={validateStatus.name === "success" ? null : "请输入活动名称！"}>
                                        <Input value={this.state.name} allowClear name="name" onChange={this.handleInputChange} />
                                    </Form.Item>
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="活动时间">
                            {requestQuantity > 0 ?
                                <Skeleton active /> :
                                !alterInfo ?
                                    timeStampConvertToFormatTime(byActivities[activityId].startTime) + " ~ " + timeStampConvertToFormatTime(byActivities[activityId].endTime)
                                    : <RangePicker
                                        showTime
                                        defaultValue={[moment( timeStampConvertToFormatTime(byActivities[activityId].startTime) , dateFormat), moment(timeStampConvertToFormatTime(byActivities[activityId].endTime), dateFormat)]}
                                        format={dateFormat} />
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="活动描述" span={2}>
                            {requestQuantity > 0 ?
                                <Skeleton active /> :
                                !alterInfo ?
                                    byActivities[activityId].description
                                    : <TextArea rows={3} value={this.state.description} allowClear name="description" onChange={this.handleChange} />
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
                                    : null
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="互斥活动" span={2}>
                            {requestQuantity > 0 ?
                                <Skeleton active /> :
                                !alterInfo ?
                                    <ol>
                                        {byActivities[activityId].mutexRange.map(item => <li key={item}>{byActivities[item].name}</li>)}
                                    </ol>
                                    : null
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
                                            max={1}
                                            onChange={this.fileListOnChange} />
                            }
                        </Descriptions.Item>
                    </Descriptions>
                    {alterInfo &&
                        <Row style={{ margin: "20px 0" }}>
                            <Col span={12} offset={4}>
                                <Button type="primary" block onClick={this.completeAlter} >{requestQuantity > 0 ? "" : "确认修改"}</Button>
                            </Col>
                            <Col span={4} push={4}>
                                <Button block onClick={this.handleCancelAlter}>取消修改</Button>
                            </Col>
                        </Row>
                    }
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
        requestQuantity: getRequestQuantity(state),
        byActivityRules: getByActivityRules(state),
        // productType: getProductType(state),
        // byProductType: getByProductType(state),
        // customerType: getCustomerType(state),
        // byCustomerType: getByCustomerType(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(activityActions, dispatch),
        ...bindActionCreators(uiActions, dispatch),
        ...bindActionCreators(appActions, dispatch),
        // ...bindActionCreators(productActions, dispatch),
        // ...bindActionCreators(customerActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityDetail);