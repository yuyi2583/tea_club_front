import React from "react";
import { PageHeader, Button, Form, DatePicker, Input, Select, Spin, Modal } from "antd";
import PictureCard from "../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as activityActions, getActivities, getByActivities } from "../../../redux/modules/activity";
import { Redirect } from "react-router-dom";
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
        this.props.fetchActivitiesNameDesc();
    }

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
                        console.log("values", values);
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

    render() {
        const { from } = this.state;
        if (from != null) {
            return <Redirect to={from} />;
        }
        const { getFieldDecorator } = this.props.form;
        const { retrieveRequestQuantity, activities, byActivities } = this.props;
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
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        activities: getActivities(state),
        byActivities: getByActivities(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(activityActions, dispatch),
    };
};

const AddActivityForm = Form.create({ name: 'addActivity' })(AddActivity);
export default connect(mapStateToProps, mapDispatchToProps)(AddActivityForm);