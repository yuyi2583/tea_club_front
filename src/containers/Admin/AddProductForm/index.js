import React from "react";
import { PageHeader, Button, Form, DatePicker, Input, Select, Spin, TreeSelect, Modal, InputNumber } from "antd";
import PictureCard from "../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as uiActions, getModalVisible } from "../../../redux/modules/ui";
import { actions as productActions, getProductType, getByProductType, getByProductDetail, getProductDetail } from "../../../redux/modules/product";
// import { getRetrieveRequestQuantity, getModalRequestQuantity } from "../../../redux/modules/app";
import { Redirect } from "react-router-dom";
import { map } from "../../../router";
import { formItemLayout, tailFormItemLayout } from "../../../utils/common";

const { Option } = Select;
const { confirm } = Modal;

class AddProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: new Array(),
            from: null,
            newCategory: "",
        }
    }

    componentDidMount() {
        this.props.fetchProductType();
    }

    handleSubmit = e => {
        e.preventDefault();
        const { fileList } = this.state;;
        const thiz = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                confirm({
                    title: '确认新增?',
                    content: '输入数据是否无误，确认新增该活动信息',
                    onCancel() {
                    },
                    onOk() {
                        console.log("submit values", values);
                        thiz.props.createProduct(values)
                            .then(() => {
                                this.props.callMessage("success", "新增产品成功！")
                                thiz.setState({
                                    from: map.admin.AdminHome() + `/product_management/products`
                                });
                            })
                            .catch((err) => {
                                this.props.callMessage("error", "新增产品失败！" + err)
                            })
                    },
                });

            }
        });
    };

    handleCreateNewCategory = () => {
        const { newCategory } = this.state;
        this.props.createNewProductType(newCategory)
            .then(() => {
                this.props.closeModal();
                this.props.callMessage("success", "创建产品种类成功！");
                this.setState({ newCategory: "" });
            })
            .catch(err => {
                this.props.callMessage("error", "创建产品种类失败！" + err);
            });
    }

    handleNewCategoryChange = (e) => {
        const name = e.target.name;
        this.setState({
            [name]: e.target.value
        })
    }


    handleDisplayChange = (fileList) => {
        this.setState({ fileList });
    }

    render() {
        const { from } = this.state;
        if (from != null) {
            return <Redirect to={from} />;
        }
        const { getFieldDecorator } = this.props.form;
        const { fileList, newCategory } = this.state;
        const { requestQuantity, modalVisible, productType, byProductType, modalRequestQuantity } = this.props;
        return (
            <div>
                <PageHeader
                    title="添加产品"
                    onBack={this.props.handleBack}>
                    <Spin spinning={requestQuantity > 0}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                            <Form.Item label="产品名称">
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入产品名称!',
                                        },
                                    ],
                                })(<Input allowClear placeholder="请输入产品名称" />)}
                            </Form.Item>
                            <Form.Item label="产品种类">
                                {getFieldDecorator('type', {
                                    rules: [{ required: true, message: '请选择产品种类!' }],
                                })(
                                    <Select
                                        placeholder="请选择产品种类"
                                        onChange={this.handleSelectActivityTypeChange}>
                                        {
                                            productType.map(uid => <Option key={uid} value={uid}>{byProductType[uid].type}</Option>)
                                        }
                                    </Select>)
                                }
                                <Button type="primary" onClick={() => this.props.openModal()}>创建新种类</Button>
                            </Form.Item>
                            <Form.Item label="产品价格">
                                {getFieldDecorator('price', {
                                    rules: [{ required: true, message: '请输入产品价格!' }],
                                })(<InputNumber
                                    min={0}
                                    style={{ width: "100px", marginRight: "10px" }} />)
                                }元
                            </Form.Item>
                            <Form.Item label="产品存量">
                                {getFieldDecorator('storage', {
                                    rules: [{ required: true, message: '请输入产品存量!' }],
                                    initialValue: 0
                                })(<InputNumber
                                    min={0}
                                    style={{ width: "100px", marginRight: "10px" }} />)
                                }件
                            </Form.Item>
                            <Form.Item label="产品描述">
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
                            <Form.Item label="活动展示照片">
                                <PictureCard
                                    fileList={fileList}
                                    max={4}
                                    onChange={this.handleDisplayChange} />
                            </Form.Item>
                            <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit" block loading={requestQuantity > 0}>
                                    新增产品
                                </Button>
                            </Form.Item>
                        </Form>
                    </Spin>
                </PageHeader>
                <Modal
                    title="新增产品种类"
                    visible={modalVisible}
                    onOk={this.handleCreateNewCategory}
                    confirmLoading={modalRequestQuantity > 0}
                    onCancel={() => this.props.closeModal()}
                >
                    <Input placeholder="请输入种类名称" name="newCategory" value={newCategory} onChange={this.handleNewCategoryChange} />
                </Modal>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => {
    return {
        productType: getProductType(state),
        byProductType: getByProductType(state),
        // requestQuantity: getRetrieveRequestQuantity(state),
        // modalRequestQuantity: getModalRequestQuantity(state),
        productDetail: getProductDetail(state),
        byProductDetail: getByProductDetail(state),
        modalVisible: getModalVisible(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(productActions, dispatch),
        ...bindActionCreators(uiActions, dispatch),
    };
};

const AddProductForm = Form.create({ name: 'addProduct' })(AddProduct);
export default connect(mapStateToProps, mapDispatchToProps)(AddProductForm);