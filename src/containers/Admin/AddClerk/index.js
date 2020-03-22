import React from "react";
import { PageHeader, Button, Form, Radio, Input, Select, Spin, TreeSelect, Modal } from "antd";
import PictureCard from "../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getShops, getByShops } from "../../../redux/modules/shop";
import { actions as clerkActions, getPositions, getByPositions, getByAuthority, getByBelong } from "../../../redux/modules/clerk";
import { Redirect } from "react-router-dom";
import { map } from "../../../router";
import { formItemLayout, tailFormItemLayout, sex } from "../../../utils/common";

const { Option } = Select;
const { confirm } = Modal;
const { SHOW_PARENT } = TreeSelect;

class AddClerk extends React.Component {
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
                    content: '输入数据是否无误，确认新增该职员信息',
                    onCancel() {
                    },
                    onOk() {
                        console.log("submit values", values);
                        const clerk = { ...values, avatar: fileList.length > 0 ? fileList[0] : null };
                        thiz.props.addClerk(clerk)
                            .then(() => {
                                thiz.props.callMessage("success", "新增职员完成！")
                                thiz.setState({
                                    from: map.admin.AdminHome() + `/clerk_management/clerks`
                                });
                            })
                            .catch((err) => {
                                thiz.props.callMessage("error", "新增职员失败！" + err)
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
                console.log("add shop photo ", data);
                if (fileList.indexOf(data.uid) == -1) {
                    this.setState({ fileList: fileList.concat([data.uid]) });
                }
                break;
            case "removed":
                console.log("remove shop photo ", data);
                let newFileList = fileList.filter(uid => uid != data.uid);
                this.setState({ fileList: newFileList });
                break;
        }
    }

    componentDidMount() {
        this.props.fetchShops();
        this.props.fetchPositions();
    }

    render() {
        const { from } = this.state;
        if (from != null) {
            return <Redirect to={from} />;
        }
        const { getFieldDecorator } = this.props.form;
        const { retrieveRequestQuantity, shops, byShops, positions, byPositions } = this.props;
        return (
            <PageHeader
                title="新增门店"
                onBack={this.props.handleBack}>
                <Spin spinning={retrieveRequestQuantity > 0}>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label="姓名">
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入职员姓名!',
                                    },
                                ],
                            })(<Input allowClear />)}
                        </Form.Item>
                        <Form.Item label="性别">
                            {getFieldDecorator('sex', {
                                rules: [
                                    {
                                        required: true,
                                        message: "请选择性别！",
                                    }
                                ]
                            })(
                                <Radio.Group>
                                    <Radio value={0}>{sex[0]}</Radio>
                                    <Radio value={1}>{sex[1]}</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                        <Form.Item label="联系方式">
                            {getFieldDecorator('contact', {
                                rules: [{ required: true, message: '请输入联系方式!' }],
                            })(<Input allowClear />)}
                        </Form.Item>
                        <Form.Item label="住址">
                            {getFieldDecorator('address', {
                                rules: [{ required: true, message: '请输入职员住址!' }],
                            })(<Input.TextArea rows={3} allowClear />)}
                        </Form.Item>
                        <Form.Item label="身份证号">
                            {getFieldDecorator('identityId', {
                                rules: [{ required: true, message: '请输入身份证号!' }],
                            })(<Input allowClear />)}
                        </Form.Item>
                        <Form.Item label="所属门店">
                            {getFieldDecorator('shop')(
                                <Select placeholder="请选择门店">
                                    {
                                        shops.map((uid) => (
                                            <Option key={uid} value={uid}>{byShops[uid].name}</Option>
                                        ))
                                    }
                                </Select>,
                            )}
                        </Form.Item>
                        <Form.Item label="职位">
                            {getFieldDecorator('position')(
                                <Select placeholder="请选择职位">
                                    {
                                        positions.map((uid) => (
                                            <Option key={uid} value={uid}>{byPositions[uid].name}</Option>
                                        ))
                                    }
                                </Select>,
                            )}
                        </Form.Item>
                        <Form.Item label="照片">
                            <PictureCard max={1} onChange={this.handleDisplayChange} />
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" block>
                                新增人员
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </PageHeader>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        positions: getPositions(state),
        byPositions: getByPositions(state),
        shops: getShops(state),
        byShops: getByShops(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(clerkActions, dispatch),
        ...bindActionCreators(shopActions, dispatch),
    };
};

const AddClerkForm = Form.create({ name: 'addClerk' })(AddClerk);
export default connect(mapStateToProps, mapDispatchToProps)(AddClerkForm);