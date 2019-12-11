import React from "react";
import {
    Form,
    Input,
    Tooltip,
    Icon,
    Button,
    InputNumber,
    TimePicker,
    Modal,
    message,
    Select
} from 'antd';
import PictureCard from "../../../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions } from "../../../../../redux/modules/shop";
import { getRequestQuantity, getError } from "../../../../../redux/modules/app";
import { Redirect } from "react-router-dom";
import { map } from "../../../../../router"
import moment from 'moment';
import "./style.css";

const format = 'HH:mm';
const { Option } = Select;
const { confirm } = Modal;

class AddShop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: new Array(),
            redirectToReferrer: false,
            openHours: [0],
            byOpenHours: {
                0: { endTime: null, startTime: null, repeat: new Array(), endStatus: "success", startStatus: "success", repeatStatus: "success" }
            }
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        const { fileList, byOpenHours, openHours } = this.state;
        const thiz = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let breakFlag = true;
                openHours.forEach((item) => {
                    let startStatus = "success";
                    let endStatus = "success";
                    let repeatStatus = "success";
                    if (byOpenHours[item].startTime == null || byOpenHours[item].startTime === "") {
                        startStatus = "error";
                        breakFlag = false;
                    } else {
                        startStatus = "success";
                    }
                    if (byOpenHours[item].endTime == null || byOpenHours[item].endTime === "") {
                        endStatus = "error";
                        breakFlag = false;
                    } else {
                        endStatus = "success";
                    }
                    if (byOpenHours[item].repeat.length === 0) {
                        repeatStatus = "error";
                        breakFlag = false;
                    } else {
                        repeatStatus = "success";
                    }
                    let byOpenHoursItem = {
                        ...byOpenHours[item],
                        repeatStatus: repeatStatus,
                        startStatus: startStatus,
                        endStatus: endStatus
                    };
                    thiz.setState({ byOpenHours: { ...byOpenHours, [item]: byOpenHoursItem } });
                })
                if (!breakFlag) {
                    return;
                }
                values = { ...values, openHours, byOpenHours, fileList };
                confirm({
                    title: '确认新增门店?',
                    content: '输入数据是否无误，确认新增该门店',
                    onCancel() {
                    },
                    onOk() {
                        const newShop = { ...values };
                        console.log("new shop", newShop);
                        thiz.props.addShop(newShop).then(() => {
                            thiz.props.callMessage("success", "新增门店成功！");
                            thiz.setState({ redirectToReferrer: true });
                        }).catch((err) => {
                            thiz.props.callMessage("error", "新增门店失败!" + err);
                        });
                    },
                });

            }
        });
    };

    handleDisplayChange = (fileList) => {
        this.setState({ fileList });
    }

    handleStartTimePickerChange = (time, timeString, index) => {
        const newOpenHour = { ...this.state.byOpenHours[index], startTime: timeString };
        this.setState({ byOpenHours: { ...this.state.byOpenHours, [index]: newOpenHour } });
    }

    handleEndTimePickerChange = (time, timeString, index) => {
        const newOpenHour = { ...this.state.byOpenHours[index], endTime: timeString };
        this.setState({ byOpenHours: { ...this.state.byOpenHours, [index]: newOpenHour } });
    }

    handleRepeatChange = (value, index) => {
        const newOpenHour = { ...this.state.byOpenHours[index], repeat: value };
        this.setState({ byOpenHours: { ...this.state.byOpenHours, [index]: newOpenHour } });
    }

    handleAddOpenHour = () => {
        let openHours = new Array();
        this.state.openHours.forEach((item) => {
            openHours.push(item);
        })
        openHours.push(openHours[openHours.length - 1] + 1);
        const byOpenHours = { ...this.state.byOpenHours, [openHours[openHours.length - 1]]: { endTime: null, startTime: null, repeat: new Array(), endStatus: "success", startStatus: "success", repeatStatus: "success" } };
        this.setState({ openHours, byOpenHours })
    }

    handleRemoveOpenHour = (index) => {
        const openHours = this.state.openHours.filter((item) => item !== index);
        this.setState({ openHours });
    }

    render() {
        const { from } = { from: { pathname: map.admin.AdminHome() + "/company/shop_management" } };
        console.log("from",from)
        const { redirectToReferrer } = this.state;
        if (redirectToReferrer) {
            return <Redirect to={from} />;
        }
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
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
        const { fileList, openHours, byOpenHours } = this.state;
        const { requestQuantity } = this.props;
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="门店名称">
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: '请输入门店名称!',
                            },
                        ],
                    })(<Input allowClear />)}
                </Form.Item>
                <Form.Item label="门店联系方式">
                    {getFieldDecorator('contact', {
                        rules: [
                            {
                                required: true,
                                message: '请输入门店联系方式!',
                            },
                        ],
                    })(<Input allowClear />)}
                </Form.Item>
                <Form.Item label="门店地址">
                    {getFieldDecorator('address', {
                        rules: [{ required: true, message: '请输入门店地址!' }],
                    })(<Input allowClear />)}
                </Form.Item>
                <Form.Item label="门店描述">
                    {getFieldDecorator('description', {
                        rules: [{ required: true, message: '请输入门店描述!' }],
                    })(<Input.TextArea rows={4} allowClear />)}
                </Form.Item>
                <Form.Item label="门店营业时间" style={{ marginBottom: 0 }} required>
                    {openHours.map((id) => {
                        return (
                            <div key={id}>
                                <Form.Item
                                    validateStatus={byOpenHours[id].startStatus}
                                    help={byOpenHours[id].startStatus === "success" ? "" : "请输入门店开始营业时间"}
                                    style={{ display: 'inline-block' }}>
                                    <TimePicker
                                        value={byOpenHours[id].startTime && moment(byOpenHours[id].startTime, format)}
                                        format={format}
                                        placeholder="选择开始时间"
                                        onChange={(time, timeString) => this.handleStartTimePickerChange(time, timeString, id)} />
                                </Form.Item>
                                <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                                <Form.Item
                                    validateStatus={byOpenHours[id].endStatus}
                                    help={byOpenHours[id].endStatus === "success" ? "" : "请输入门店打烊时间"}
                                    style={{ display: 'inline-block' }}>
                                    <TimePicker
                                        value={byOpenHours[id].endTime && moment(byOpenHours[id].endTime, format)}
                                        format={format}
                                        placeholder="选择打烊时间"
                                        onChange={(time, timeString) => this.handleEndTimePickerChange(time, timeString, id)} />
                                </Form.Item>
                                <span style={{ display: 'inline-block', width: '50px', textAlign: 'center' }}>重复</span>
                                <Form.Item
                                    validateStatus={byOpenHours[id].repeatStatus}
                                    help={byOpenHours[id].repeatStatus === "success" ? "" : "请选择重复时间"}
                                    style={{ display: 'inline-block', width: "100px" }}>
                                    <Select mode="tags" onChange={(value) => this.handleRepeatChange(value, id)} tokenSeparators={[',']}>
                                        <Option key={1}>周一</Option>
                                        <Option key={2}>周二</Option>
                                        <Option key={3}>周三</Option>
                                        <Option key={4}>周四</Option>
                                        <Option key={5}>周五</Option>
                                        <Option key={6}>周六</Option>
                                        <Option key={7}>周日</Option>
                                    </Select>
                                </Form.Item>
                                {id == 0 ?
                                    (<Tooltip title="新增营业时间">
                                        <Icon
                                            className="hover-pointer dynamic-button"
                                            type="plus-circle"
                                            onClick={this.handleAddOpenHour} />
                                    </Tooltip>)
                                    : (<Tooltip title="删除此时间">
                                        <Icon
                                            className="hover-pointer dynamic-button"
                                            type="minus-circle-o"
                                            onClick={() => this.handleRemoveOpenHour(id)}
                                        />
                                    </Tooltip>
                                    )}
                            </div>
                        )
                    })}

                </Form.Item>
                <Form.Item label="门店图片展示">
                    <PictureCard
                        fileList={fileList}
                        onChange={this.handleDisplayChange} />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" block loading={requestQuantity > 0}>
                        确认
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        requestQuantity: getRequestQuantity(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(shopActions, dispatch),
    };
};
const AddShopForm = Form.create({ name: 'addBox' })(AddShop);

export default connect(mapStateToProps, mapDispatchToProps)(AddShopForm);