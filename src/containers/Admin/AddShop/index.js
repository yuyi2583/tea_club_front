import React from "react";
import { Form, Input, Button, Modal, PageHeader, Spin } from 'antd';
import PictureCard from "../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions } from "../../../redux/modules/shop";
import { getRetrieveRequestQuantity } from "../../../redux/modules/app";
import { Redirect,Prompt } from "react-router-dom";
import { map } from "../../../router"
import "./style.css";
import { formItemLayout, tailFormItemLayout } from "../../../utils/common";
import DynamicFieldSet from "../../../components/DynamicFieldSet";
import ShopOpenHour from "../../../components/ShopOpenHour";
import validator from "../../../utils/validator";

const { confirm } = Modal;

class AddShop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: new Array(),
            from:null,
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        const { fileList } = this.state;
        const thiz = this;
        const {getFieldsValue}=this.props.form;
        console.log("field value", getFieldsValue());
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                confirm({
                    title: '确认新增门店?',
                    content: '输入数据是否无误，确认新增该门店',
                    onCancel() {
                    },
                    onOk() {
                        const { keys } = values;
                        let openHours = new Array();
                        keys.forEach(index => {
                            let openHour = new Object();
                            for (let key in values) {
                                if (key.indexOf(index) != -1) {
                                    if (key.indexOf("date") == -1) {
                                        openHour[key.split("_")[0]] = values[key].format("HH:mm");
                                    } else {
                                        openHour[key.split("_")[0]] = values[key];
                                    }
                                }
                            }
                            openHours.push(openHour);
                        })
                        values = { ...values, photos: fileList, openHours };
                        console.log("submit value in add shop", values);
                        thiz.props.addShop(values).then(() => {
                            thiz.props.callMessage("success", "新增门店成功！");
                            thiz.setState({
                                from: map.admin.AdminHome() + `/shop_management/shops`
                            });
                        }).catch((err) => {
                            thiz.props.callMessage("error", "新增门店失败!" + err);
                        });
                    },
                });

            }
        });
    };

    handleDisplayChange = (type,data) => {
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
        const { retrieveRequestQuantity, connectError } = this.props;
        const {from}=this.state;
        if (from != null) {
            return <Redirect to={from} />;
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <PageHeader
                title="新增门店"
                onBack={this.props.handleBack}>
                <Spin spinning={retrieveRequestQuantity > 0}>
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
                                    validator.phone
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
                            <DynamicFieldSet form={this.props.form} content={"添加营业时间"}
                                template={<ShopOpenHour
                                    form={this.props.form} />}
                            />
                        </Form.Item>
                        <Form.Item label="门店图片展示">
                            <PictureCard onChange={this.handleDisplayChange} />
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" block>
                                确认
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
                <Prompt message="当前页面正在输入中，离开此页面您输入的数据不会被保存，是否离开?" when={true} />
            </PageHeader>
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
const AddShopForm = Form.create({ name: 'addShop' })(AddShop);

export default connect(mapStateToProps, mapDispatchToProps)(AddShopForm);