import React from "react";
import { Form, Input, Tooltip, Icon, Button, InputNumber, PageHeader, Select, Modal, Spin, Divider } from 'antd';
import PictureCard from "../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getShops, getByShops } from "../../../redux/modules/shop";
import { Redirect, Link } from "react-router-dom";
import { map } from "../../../router";
import { formItemLayout, tailFormItemLayout } from "../../../utils/common";

const { confirm } = Modal;
const { Option } = Select;

class AddBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: new Array(),
            from: null,
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        const { fileList } = this.state;
        const thiz = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                confirm({
                    title: '确认新增?',
                    content: '输入数据是否无误，确认新增该包厢信息',
                    onCancel() {
                    },
                    onOk() {
                        console.log("values", values);
                        console.log("file list", fileList);
                        const shopBox = { ...values, photos: fileList };
                        thiz.props.addBoxInfo(shopBox).then(() => {
                            thiz.props.callMessage("success", "新增包厢成功！");
                            thiz.setState({
                                from: map.admin.AdminHome() + `/shop_management/shop_boxes`
                            });
                        }).catch((err) => {
                            thiz.props.callMessage("error", "新增包厢失败!" + err);
                        });
                    },
                });

            }
        });
    };

    handleDisplayChange = (data) => {
        console.log("add shop photo uid", data);
        const { fileList } = this.state;
        if (fileList.indexOf(data.uid) == -1) {
            this.setState({ fileList: fileList.concat([data.uid]) });
        }
    }

    componentDidMount() {
        this.props.fetchShops()
    }

    render() {
        const { from } = this.state;
        if (from != null) {
            return <Redirect to={from} />;
        }
        const { getFieldDecorator } = this.props.form;
        const { retrieveRequestQuantity, shops, byShops } = this.props;
        return (
            <PageHeader
                title="新增包厢"
                onBack={this.props.handleBack}>
                <Spin spinning={retrieveRequestQuantity > 0}>
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
                        <Form.Item label="包厢所属门店">
                            {getFieldDecorator('shopId', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择包厢所属门店!',
                                    },
                                ],
                            })(<Select
                                mode="tags"
                                tokenSeparators={[',']}
                                dropdownRender={menu => (
                                    <div>
                                        {menu}
                                        <Divider style={{ margin: '4px 0' }} />
                                        <Link to={`${map.admin.AdminHome()}/shop_management/add_shop`}><Icon type="plus" /> 添加门店</Link>
                                    </div>
                                )}>
                                {shops.map(uid => <Option key={uid}>{byShops[uid].name}</Option>)}
                            </Select>)}
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
                            })(<InputNumber min={0} />)}元/小时
                        </Form.Item>
                        <Form.Item label="一泡茶时间">
                            {getFieldDecorator('duration', {
                                rules: [{ required: true, message: '请输入每泡茶时间!' }],
                                initialValue: 120
                            })(<InputNumber min={0} />)}分钟
                        </Form.Item>
                        <Form.Item label="包厢描述">
                            {getFieldDecorator('description', {
                                rules: [{ required: true, message: '请输入包厢描述!' }],
                            })(<Input.TextArea rows={4} />)}
                        </Form.Item>
                        <Form.Item label="包厢展示">
                            <PictureCard onChange={this.handleDisplayChange} />
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" block>
                                注册包厢
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </PageHeader>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        shops: getShops(state),
        byShops: getByShops(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(shopActions, dispatch),
    };
};
const AddBoxForm = Form.create({ name: 'addBox' })(AddBox);

export default connect(mapStateToProps, mapDispatchToProps)(AddBoxForm);