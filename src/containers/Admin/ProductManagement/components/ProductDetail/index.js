import React from "react";
import { Descriptions, Row, Col, Skeleton,Radio, Typography, Button, Spin, Input, Select, Empty, Form, Modal, InputNumber, Tooltip, Icon } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as productActions, getProducts, getByProducts, getProductTypes, getByProductTypes, getByProductActivities, getByProductPhotos } from "../../../../../redux/modules/product";
import { productStatus } from "../../../../../utils/common";
import { callNotification } from "../../../../../utils/commonUtils";
import { Prompt, Link } from "react-router-dom";
import PictureCard from "../../../../../components/PictureCard";
import { map } from "../../../../../router";
import {Redirect} from "react-router-dom";

const { Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

class ProductDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: new Array(),
            detailFileList:new Array(),
            from:null,
        }
    }

    componentDidMount() {
        const { productId } = this.props.match.params;
        this.props.fetchProduct(productId)
            .then(() => {
                this.setState({
                    fileList: this.props.byProducts[productId].photos,
                    detailFileList: this.props.byProducts[productId].productDetails
                 })
            })
            .catch(err => {
                this.props.callMessage("error", err);
                this.setState({from:`${map.admin.AdminHome()}/product_management/products`})
            });
        this.props.fetchProductTypes();
    }

    componentDidUpdate(prevProps) {
        const { productId } = this.props.match.params;
        const { byProducts } = this.props;
        if (this.props.alterInfo && byProducts[productId].enforceTerminal && !prevProps.alterInfo) {
            callNotification("error", "该产品已下架，无法更改其信息");
            this.props.finishAlterInfo();
        }

    }

    handleSubmit = e => {
        e.preventDefault();
        const { productId } = this.props.match.params;
        const { fileList,detailFileList } = this.state;;
        const { byProducts, byProductTypes } = this.props;
        const thiz = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                confirm({
                    title: '确认修改?',
                    content: '输入数据是否无误，确认修改该产品信息',
                    onCancel() {
                    },
                    onOk() {
                        const product = {
                            ...values, productDetails:detailFileList,photos: fileList, uid: productId, type: { ...byProductTypes[values.type] },
                            price: { ingot: values.ingot, credit: values.credit, uid: byProducts[productId].price.uid }
                        };
                        console.log("submit values", product);
                        thiz.props.updateProduct(product)
                            .then(() => {
                                thiz.props.callMessage("success", "修改产品信息成功！");
                                thiz.props.finishAlterInfo();
                            })
                            .catch((err) => {
                                console.error(err);

                                thiz.props.callMessage("error", "修改产品信息失败！" + err)
                            })
                    },
                });

            }
        });
    };

    getPriceDisplay = () => {
        const { productId } = this.props.match.params;
        const { byProducts } = this.props;
        let display = <Empty />;
        try {
            const ingot = byProducts[productId].price.ingot == 0 ? "" : `${byProducts[productId].price.ingot}元宝`;
            const credit = byProducts[productId].price.credit == 0 ? "" : `${byProducts[productId].price.credit}积分`;
            display = ingot + credit;
        } catch{
            display = <Empty />;
        }
        return display;
    }

    getPhotosDisplay = () => {
        const { productId } = this.props.match.params;
        const { byProducts, byProductPhotos } = this.props;
        let photoDisplay = new Array();
        let photoDetailDisplay=new Array();
        try {
            photoDisplay = byProducts[productId].photos.map((uid) => ({
                uid,
                name: 'image.png',
                status: 'done',
                type: "image/jpeg",
                thumbUrl: `data:image/png;base64,${byProductPhotos[uid].photo}`,
            }))
            photoDetailDisplay = byProducts[productId].productDetails.map((uid) => ({
                uid,
                name: 'image.png',
                status: 'done',
                type: "image/jpeg",
                thumbUrl: `data:image/png;base64,${byProductPhotos[uid].photo}`,
            }))
        } catch (err) {
            photoDisplay = new Array();
            photoDetailDisplay=new Array();
        }
        return {
            photoDisplay,
            photoDetailDisplay
        };
    }

    

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

    handleDisplayDetailChange = (type, data) => {
        const { detailFileList } = this.state;
        switch (type) {
            case "done":
                console.log("add shop photo", data);
                if (detailFileList.indexOf(data.uid) == -1) {
                    this.setState({ detailFileList: detailFileList.concat([data.uid]) });
                }
                break;
            case "removed":
                console.log("remove shop photo", data);
                let newFileList = detailFileList.filter(uid => uid != data.uid);
                this.setState({ detailFileList: newFileList });
                break;
        }
    }

    getActivitiesDisplay = () => {
        const { productId } = this.props.match.params;
        const { byProducts, byProductActivities } = this.props;
        let display = <Empty />;
        try {
            display = byProducts[productId].activities.map(uid =>
                <Paragraph key={uid}>
                    <Tooltip title={`查看${byProductActivities[uid].name}详细信息`}>
                        <Link to={`${map.admin.AdminHome()}/activity_management/activities/activity/${uid}`}>
                            <Icon type="info-circle" />
                        </Link>
                    </Tooltip>
                    &nbsp;&nbsp;
                    <strong>活动名称</strong>：{byProductActivities[uid].name}
                    &nbsp;&nbsp;
                    <strong>活动描述</strong>：{byProductActivities[uid].description}
                </Paragraph>
            )
        } catch (err) {
            console.error(err)
            display = <Empty />;
        }
        return display;
    }

    render() {
        const { from } = this.state;
        if (from != null) {
            return <Redirect to={from} />;
        }
        const { productId } = this.props.match.params;
        const { alterInfo, retrieveRequestQuantity, updateRequestQuantity, form, productTypes, byProductTypes, byProducts } = this.props;
        const { getFieldDecorator } = form;
        const priceDisplay = this.getPriceDisplay();
        const {photoDisplay,photoDetailDisplay} = this.getPhotosDisplay();
        const activitiesDisplay = this.getActivitiesDisplay();
        const isDataNull = byProducts[productId] == undefined ? true : false;
        return (
            <div style={{ marginBottom: "20px" }}>
                <Spin spinning={updateRequestQuantity > 0}>
                    {retrieveRequestQuantity > 0 ?
                        <Skeleton active />
                        :
                        <Form onSubmit={this.handleSubmit}>
                            <Descriptions bordered column={2}>
                                <Descriptions.Item label="产品名称">
                                    {
                                        !alterInfo ?
                                            isDataNull ? null : byProducts[productId].name
                                            : <Form.Item>
                                                {getFieldDecorator('name', {
                                                    rules: [{ required: true, message: '请输入产品名称!' }],
                                                    initialValue: byProducts[productId].name
                                                })(<Input allowClear name="name" placeholder="请输入产品名称" />)}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="产品种类" >
                                    {
                                        !alterInfo ?
                                            isDataNull ? null : byProducts[productId].type.name
                                            : <Form.Item>
                                                {getFieldDecorator('type', {
                                                    rules: [{ required: true, message: '请选择产品种类!' }],
                                                    initialValue: byProducts[productId].type.uid
                                                })(
                                                    <Select
                                                        placeholder="请选择产品种类"
                                                        name="type"
                                                        style={{ width: 200 }}
                                                    >
                                                        {
                                                            productTypes.map((uid) => <Option key={uid} value={uid}>{byProductTypes[uid].name}</Option>)
                                                        }
                                                    </Select>
                                                )}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="产品描述" span={2}>
                                    {
                                        !alterInfo ?
                                            isDataNull ? null : byProducts[productId].description
                                            : <Form.Item>
                                                {getFieldDecorator('description', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请输入产品描述！",
                                                        }
                                                    ],
                                                    initialValue: byProducts[productId].description
                                                })(
                                                    <TextArea rows={4} allowClear placeholder="请输入产品描述" />
                                                )}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="是否在首页展示">
                                    {
                                        !alterInfo ?
                                            isDataNull ? null :byProducts[productId].showOnHome ? "在首页展示" : "不在首页展示" :
                                            <Form.Item>
                                                {getFieldDecorator('showOnHome', {
                                                    rules: [{ required: true, message: '请选择是否在首页展示!' }],
                                                    initialValue:byProducts[productId].showOnHome
                                                })(<Radio.Group>
                                                    <Radio value={false}>否</Radio>
                                                    <Radio value={true}>是</Radio>
                                                </Radio.Group>)}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="产品状态">
                                    {isDataNull ? null : byProducts[productId].enforceTerminal ? productStatus["off_shelves"] : byProducts[productId].storage > 0 ? productStatus["on_sale"] : productStatus["sold_out"]}
                                </Descriptions.Item>
                                <Descriptions.Item label="价格">
                                    {
                                        !alterInfo ?
                                            isDataNull ? null : priceDisplay :
                                            <Row>
                                                <Col span={11}>
                                                    <Form.Item>
                                                        {getFieldDecorator('ingot', {
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: "请输入产品价格！",
                                                                }
                                                            ],
                                                            initialValue: byProducts[productId].price.ingot
                                                        })(
                                                            <InputNumber min={0} allowClear />
                                                        )}元宝
                                                    </Form.Item>
                                                </Col>
                                                <Col span={11}>
                                                    <Form.Item>
                                                        {getFieldDecorator('credit', {
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: "请输入产品价格！",
                                                                }
                                                            ],
                                                            initialValue: byProducts[productId].price.credit
                                                        })(
                                                            <InputNumber min={0} allowClear />
                                                        )}积分
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="库存（件）">
                                    {
                                        !alterInfo ?
                                            isDataNull ? null : byProducts[productId].storage :
                                            <Form.Item>
                                                {getFieldDecorator('storage', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请输入产品库存！",
                                                        }
                                                    ],
                                                    initialValue: byProducts[productId].storage
                                                })(
                                                    <InputNumber min={0} allowClear placeholder="请输入产品库存" />
                                                )}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="产品适用活动" span={2}>
                                    { activitiesDisplay}
                                </Descriptions.Item>
                                <Descriptions.Item label="产品展示照片" span={2}>
                                    {
                                        alterInfo ?
                                            <PictureCard
                                                onChange={this.handleDisplayChange}
                                                fileList={photoDisplay} />
                                            :
                                            <PictureCard
                                                fileList={photoDisplay}
                                                type={"display"} />
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="产品详情照片" span={2}>
                                    {
                                        alterInfo ?
                                            <PictureCard
                                                onChange={this.handleDisplayDetailChange}
                                                fileList={photoDetailDisplay} />
                                            :
                                            <PictureCard
                                                fileList={photoDetailDisplay}
                                                type={"display"} />
                                    }
                                </Descriptions.Item>
                            </Descriptions>
                            {alterInfo &&
                                <Row style={{ margin: "20px 0" }}>
                                    <Col span={12} offset={4}>
                                        <Button type="primary" htmlType="submit" block>确认修改</Button>
                                    </Col>
                                    <Col span={4} push={4}>
                                        <Button block onClick={() => this.props.finishAlterInfo()}>取消修改</Button>
                                    </Col>
                                </Row>
                            }
                        </Form>
                    }
                </Spin>
                <Prompt message="当前页面正在输入中，离开此页面您输入的数据不会被保存，是否离开?" when={alterInfo} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        products: getProducts(state),
        byProducts: getByProducts(state),
        productTypes: getProductTypes(state),
        byProductTypes: getByProductTypes(state),
        byProductPhotos: getByProductPhotos(state),
        byProductActivities: getByProductActivities(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(productActions, dispatch),
    };
};

const WrapedProductDetail = Form.create({ name: 'productDetail' })(ProductDetail);
export default connect(mapStateToProps, mapDispatchToProps)(WrapedProductDetail);