import React from "react";
import { PageHeader, Button, Form,  Input, Select, Spin, Row, Col, Modal, InputNumber } from "antd";
import PictureCard from "../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as productActions, getProductTypes, getByProductTypes } from "../../../redux/modules/product";
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
        this.props.fetchProductTypes();
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
                        const product = { ...values, photos: fileList, price: { ingot: values.ingot, credit: values.credit } };
                        console.log("submit values", product);
                        thiz.props.addProduct(product)
                            .then(() => {
                                thiz.props.callMessage("success", "新增产品成功！")
                                thiz.setState({
                                    from: map.admin.AdminHome() + `/product_management/products`
                                });
                            })
                            .catch((err) => {
                                thiz.props.callMessage("error", "新增产品失败！" + err)
                            })
                    },
                });

            }
        });
    };

    handleCreateNewCategory = () => {
        const { newCategory } = this.state;
        if(newCategory.length==0){
            alert("产品类型名称不能为空！");
            return;
        }
        this.props.addProductType(newCategory)
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
    //TODO 新增产品分属于那哪个门店

    render() {
        const { from } = this.state;
        if (from != null) {
            return <Redirect to={from} />;
        }
        const { getFieldDecorator } = this.props.form;
        const { fileList, newCategory } = this.state;
        const { retrieveRequestQuantity, modalVisible, productTypes, byProductTypes, modalRequestQuantity } = this.props;
        return (
            <div>
                <PageHeader
                    title="添加产品"
                    onBack={this.props.handleBack}>
                    <Spin spinning={retrieveRequestQuantity > 0}>
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
                                    <Select placeholder="请选择产品种类">
                                        {
                                            productTypes.map(uid => <Option key={uid} value={uid}>{byProductTypes[uid].name}</Option>)
                                        }
                                    </Select>)
                                }
                                <Button type="primary" onClick={() => this.props.openModal()}>创建新种类</Button>
                            </Form.Item>
                            <Form.Item label="产品价格">
                                <Row>
                                    <Col span={11}>
                                        <Form.Item>
                                            {getFieldDecorator('ingot', {
                                                rules: [{ required: true, message: '请输入产品价格!' }],
                                                initialValue: 0
                                            })(<InputNumber
                                                min={0}
                                                style={{ width: "100px", marginRight: "10px" }} />)
                                            }元宝
                                        </Form.Item>
                                    </Col><Col span={11}>
                                        <Form.Item>
                                            {getFieldDecorator('credit', {
                                                rules: [{ required: true, message: '请输入产品价格!' }],
                                                initialValue: 0
                                            })(<InputNumber
                                                min={0}
                                                style={{ width: "100px", marginRight: "10px" }} />)
                                            }积分
                                        </Form.Item>
                                    </Col>
                                </Row>
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
                                <PictureCard onChange={this.handleDisplayChange} />
                            </Form.Item>
                            <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit" block loading={retrieveRequestQuantity > 0}>
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
        productTypes: getProductTypes(state),
        byProductTypes: getByProductTypes(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(productActions, dispatch),
    };
};

const AddProductForm = Form.create({ name: 'addProduct' })(AddProduct);
export default connect(mapStateToProps, mapDispatchToProps)(AddProductForm);