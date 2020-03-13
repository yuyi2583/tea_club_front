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
    message
} from 'antd';
import PictureCard from "../../../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions } from "../../../../../redux/modules/shop";
import { getRetrieveRequestQuantity, getError } from "../../../../../redux/modules/app";
import { Redirect } from "react-router-dom";
import { map } from "../../../../../router"

const format = 'HH:mm';
const { confirm } = Modal;

class AddBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: new Array(),
            redirectToReferrer: false,
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        const { fileList } = this.state;
        const { shopId } = this.props.match.params;
        const addBoxInfo = this.props.addBoxInfo;
        const thiz = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                confirm({
                    title: '确认新增?',
                    content: '输入数据是否无误，确认新增该包厢信息',
                    onCancel() {
                    },
                    onOk() {
                        const newBoxInfo = {
                            ...values,
                            startTime: values["startTime"].format('HH:mm'),
                            endTime: values["endTime"].format('HH:mm'),
                            fileList,
                            shopId
                        }
                        thiz.props.addBoxInfo(newBoxInfo).then((data) => {
                            if (data.result) {
                                thiz.props.callMessage("success", "新增包厢成功！")
                                thiz.setState({ redirectToReferrer: true });
                            } else {
                                thiz.props.callMessage("error", "新增包厢失败!" + data.error);
                            }
                        });
                    },
                });

            }
        });
    };

    handleDisplayChange = (fileList) => {
        this.setState({ fileList });
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: map.admin.AdminHome() + "/shop_management" } };
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
        const { fileList } = this.state;
        const { requestQuantity } = this.props;
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="包厢名称">
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: '请输入包厢名称!',
                            },
                        ],
                    })(<Input allowClear />)}
                </Form.Item>
                <Form.Item label="包厢编号">
                    {getFieldDecorator('boxNum', {
                        rules: [
                            {
                                required: true,
                                message: '请输入包厢编号!',
                            },
                        ],
                    })(<Input allowClear />)}
                </Form.Item>
                <Form.Item
                    label={
                        <span>
                            费用&nbsp;
                            <Tooltip title="包厢每小时费用">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('price', {
                        initialValue: 50,
                        rules: [{ required: true, message: '请输入包厢费用!' }],
                    })(<InputNumber
                        min={0}
                        formatter={value => `${value}元/小时`}
                        parser={value => value.replace('元/小时', '')} />)}
                </Form.Item>
                <Form.Item label="包厢开放时间">
                    {getFieldDecorator('startTime', {
                        rules: [
                            { type: 'object', required: true, message: '请选择开始时间!' },
                        ],
                    })(<TimePicker placeholder="选择开始时间" format={format} />)}
                </Form.Item>
                <Form.Item label="包厢结束时间">
                    {getFieldDecorator('endTime', {
                        rules: [
                            { type: 'object', required: true, message: '请选择结束时间!' },
                        ],
                    })(<TimePicker placeholder="选择结束时间" format={format} />)}
                </Form.Item>
                <Form.Item label="包厢描述">
                    {getFieldDecorator('description', {
                        rules: [{ required: true, message: '请输入包厢描述!' }],
                    })(<Input.TextArea rows={4} />)}
                </Form.Item>
                <Form.Item label="包厢展示">
                    <PictureCard
                        fileList={fileList}
                        onChange={this.handleDisplayChange} />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" block loading={requestQuantity > 0}>
                        注册包厢
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        requestQuantity: getRetrieveRequestQuantity(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(shopActions, dispatch),
    };
};
const AddBoxForm = Form.create({ name: 'addBox' })(AddBox);

export default connect(mapStateToProps, mapDispatchToProps)(AddBoxForm);