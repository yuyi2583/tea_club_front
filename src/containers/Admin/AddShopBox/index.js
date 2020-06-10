import React from "react";
import { Form, Input, Tooltip, Icon,Radio, Button, InputNumber, PageHeader, Select, Modal, Spin, Divider, Row, Col } from 'antd';
import PictureCard from "../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getShops, getByShops } from "../../../redux/modules/shop";
import { Redirect, Link, Prompt } from "react-router-dom";
import { map } from "../../../router";
import { formItemLayout, tailFormItemLayout } from "../../../utils/common";
import DynamicFieldSet from "../../../components/DynamicFieldSet";
import ShopBoxInfoInput from "../../../components/ShopBoxInfoInput";

const { confirm } = Modal;
const { Option } = Select;

class AddShopBox extends React.Component {
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
        console.log("file list111111", fileList);
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                confirm({
                    title: '确认新增?',
                    content: '输入数据是否无误，确认新增该包厢信息',
                    onCancel() {
                    },
                    onOk() {
                        console.log("values", values);
                        const { keys } = values;
                        let infos = new Array();
                        keys.forEach(index => {
                            let info = new Object();
                            for (let key in values) {
                                if (key.indexOf(index) != -1) {
                                    if (key.indexOf("title") == -1) {
                                        info[key.split("_")[0]] = values[key];
                                    } else {
                                        info[key.split("_")[0]] = values[key];
                                    }
                                }
                            }
                            infos.push(info);
                        })
                        const shop = { uid: values.shopId };
                        const price = { ingot: values.ingot, credit: values.credit };
                        const shopBox = { ...values, shop, photos: fileList, price, infos };
                        console.log("shopbox", shopBox)
                        thiz.props.addBox(shopBox).then(() => {
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
        this.props.fetchShops()
            .catch(err => this.props.callMessage("error", err));
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
                            })(<Select dropdownRender={menu => (
                                <div>
                                    {menu}
                                    <Divider style={{ margin: '4px 0' }} />
                                    <Link to={`${map.admin.AdminHome()}/shop_management/add_shop`} style={{ margin: "5px" }}><Icon type="plus" /> 添加门店</Link>
                                </div>
                            )}>
                                {shops.filter(uid => !byShops[uid].enforceTerminal).map(uid => <Option key={uid}>{byShops[uid].name}</Option>)}
                            </Select>)}
                        </Form.Item>
                        <Form.Item
                            label={
                                <span>
                                    费用&nbsp;
                                     <Tooltip title="包厢每泡茶费用">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>
                            }
                        >
                            <Row>
                                <Col span={11}>
                                    <Form.Item>
                                        {getFieldDecorator('ingot', {
                                            initialValue: 0,
                                            rules: [{ required: true, message: '请输入包厢费用!' }],
                                        })(<InputNumber min={0} />)}元宝/泡茶
                                    </Form.Item>
                                </Col>
                                <Col span={11}>
                                    <Form.Item>
                                        {getFieldDecorator('credit', {
                                            initialValue: 0,
                                            rules: [{ required: true, message: '请输入包厢费用!' }],
                                        })(<InputNumber min={0} />)}积分/泡茶
                            </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item label="一泡茶时间">
                            {getFieldDecorator('duration', {
                                rules: [{ required: true, message: '请输入每泡茶时间!' }],
                                initialValue: 120
                            })(<InputNumber min={0} />)}分钟
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
                        <Form.Item label="包厢描述">
                            {getFieldDecorator('description', {
                                rules: [{ required: true, message: '请输入包厢描述!' }],
                            })(<Input.TextArea rows={4} />)}
                        </Form.Item>
                        <Form.Item label="包厢须知" style={{ marginBottom: 0 }} required>
                            <DynamicFieldSet form={this.props.form} content={"添加包厢须知"}
                                template={<ShopBoxInfoInput
                                    form={this.props.form} />}
                            />
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
                <Prompt message="当前页面正在输入中，离开此页面您输入的数据不会被保存，是否离开?" when={true} />
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

const AddShopBoxForm = Form.create({ name: 'addBox' })(AddShopBox);
export default connect(mapStateToProps, mapDispatchToProps)(AddShopBoxForm);