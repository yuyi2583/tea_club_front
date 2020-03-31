import React from "react";
import { Descriptions, Button, Typography, Col, Row, Spin, Tooltip, Icon, Empty, Modal, Form, Menu, Input } from "antd";
// import { actions as customerActions, getCustomers, getByCustomers,  } from "../../../../../redux/modules/customer";
import { actions as orderActions, getByOrders, getOrders, getByOrderActivityRules, getByOrderClerks, getByOrderCustomers, getByProducts } from "../../../../../redux/modules/order";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { map } from "../../../../../router";
import { sex, fetchOrdersTimeRange, orderStatus } from "../../../../../utils/common";
import { timeStampConvertToFormatTime } from "../../../../../utils/timeUtil";
import PictureDisplay from "../../../../../components/PictrueDispaly";

const { Title } = Typography;

class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderStatus: "",
            modalVisible: false,
            currentModal: "express",
        }
    }

    componentDidMount() {
        const { orderId } = this.props.match.params;
        this.props.fetchOrder(orderId);
        // this.props.fetchCustomerById(customerId);
    }


    changeOrderStatus = (event) => {
        console.log(event.target.name);
        this.setState({ orderStatus: event.target.name, modalVisible: true });

    }

    getTitleBar = () => {
        const { match, byOrders } = this.props;
        const { orderId } = match.params;
        let button = null;
        switch (byOrders[orderId].status.status) {
            case "payed":
                button = (
                    <span>
                        <Button type="primary" name="shipped" onClick={this.changeOrderStatus}>发货</Button>
                        &nbsp;&nbsp;
                        <Button name="refunded" onClick={this.changeOrderStatus}>退款</Button>
                    </span>
                );
                break;
            // case ""
        }
        return (
            <Row>
                <Col span={16}>
                    <Row>
                        <Col span={12}>
                            提单时间:{timeStampConvertToFormatTime(byOrders[orderId].orderTime)}
                        </Col>
                        <Col span={6}>
                            订单编号:{orderId}
                        </Col>
                        <Col span={6}>
                            订单状态:{orderStatus[byOrders[orderId].status.status]}
                        </Col>
                    </Row>
                </Col>
                <Col span={8} style={{ display: "flex", justifyContent: "flex-end" }}>
                    {button}
                </Col>
            </Row>
        )
    }

    getProductsDisplay = () => {
        const { match, byOrders, byOrderProducts } = this.props;
        const { orderId } = match.params;
        const order = byOrders[orderId];
        let display = <Empty />;
        try {
            display = order.products.map(uid => {
                console.log("photo", byOrderProducts[uid].product.photos);
                const photo = byOrderProducts[uid].product.photos[0] == undefined ? undefined : byOrderProducts[uid].product.photos[0].photo;
                return (
                    <Row key={uid} style={{ margin: "5px 0" }} type="flex" justify="center" align="middle">
                        <Col span={8}>
                            <PictureDisplay photo={photo} />
                        </Col>
                        <Col span={8}>{byOrderProducts[uid].product.name}</Col>
                        <Col>x {byOrderProducts[uid].number}</Col>
                    </Row>)
            }
            )
        } catch (err) {
            // console.error(err);

            display = <Empty />;
        }
        return display;
    }

    getAmountDisplay = () => {
        const { match, byOrders } = this.props;
        const { orderId } = match.params;
        const order = byOrders[orderId];
        let display = "";
        if (order.amount.ingot != 0) {
            display += `${order.amount.ingot}元宝`;
        }
        if (order.amount.credit != 0) {
            display += `${order.amount.credit}积分`;
        }
        return display;
    }

    handleModalCancel = () => {
        this.setState({ modalVisible: false, currentModal: "express" });

    }

    handleModalOk = () => {
        const { orderStatus, currentModal } = this.state;
        const { orderId } = this.props.match.params;
        const { byOrders } = this.props;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let params=new Object();
                if(orderStatus=="shipped"){
                    params={uid:orderId,trackInfo:{...values}};
                }
                this.props.updateOrderStatus(orderStatus,params).then(() => {
                    this.props.callMessage("success", "更新订单状态成功！");
                    this.setState({ modalVisible: false });
                }).catch((err) => {
                    this.props.callMessage("error", "更新订单状态失败!" + err);
                });

            }
        });
    }

    handleClickMenu = e => {
        console.log('click ', e);
        this.setState({
            currentModal: e.key,
        });
    };

    getModalContent = () => {
        const { orderStatus } = this.state;
        let title = "";
        let content = "";
        const { getFieldDecorator } = this.props.form;
        switch (orderStatus) {
            case "shipped":
                title = "填写物流信息";
                content = (
                    <span>
                        <Menu onClick={this.handleClickMenu} selectedKeys={[this.state.currentModal]} mode="horizontal">
                            <Menu.Item key="express">
                                <Icon type="mail" />
                                物流公司
                            </Menu.Item>
                            <Menu.Item key="individual">
                                <Icon type="appstore" />
                                个人配送
                            </Menu.Item>
                        </Menu>
                        {this.state.currentModal == "express" ?
                            <Form>
                                <Form.Item label="物流单号">
                                    {getFieldDecorator('trackingId', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入物流单号!',
                                            },
                                        ],
                                    })(<Input allowClear />)}
                                </Form.Item>
                                <Form.Item label="物流公司">
                                    {getFieldDecorator("companyName", {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入物流公司名称!',
                                            },
                                        ],
                                    })(<Input allowClear />)}
                                </Form.Item>
                            </Form>
                            :
                            <Form>
                                <Form.Item label="配送人电话">
                                    {getFieldDecorator('phone', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入配送人电话!',
                                            },
                                        ],
                                    })(<Input allowClear />)}
                                </Form.Item>
                                <Form.Item label="描述">
                                    {getFieldDecorator("description", {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入描述信息!',
                                            },
                                        ],
                                    })(<Input allowClear />)}
                                </Form.Item>
                            </Form>
                        }
                    </span>
                );
                break;
        }
        return {
            title,
            content
        }
    }

    render() {
        const { match, retrieveRequestQuantity, modalRequestQuantity, orders, byOrders, byOrderProducts, byOrderCustomers } = this.props;
        const { orderId } = match.params;
        const { modalVisible } = this.state;
        const order = byOrders[orderId];
        // const fileListInProps = this.getFileList(byOrders[orderId].picture);
        // let loading = false;
        const titleBar = this.getTitleBar();
        // try {
        //     const { price } = byOrders[orderId].product;
        //     const { ingot, credit } = price;
        //     const { activityRule } = byOrders[orderId].activity;
        // } catch{
        //     loading = true;
        // }
        let isDataNull = false;
        // if(byOrderProducts["1"]==undefined){
        //     isDataNull=true;
        // }
        const productsDisplay = this.getProductsDisplay();
        const amountDisplay = this.getAmountDisplay();
        const { title, content } = this.getModalContent()
        return (
            <Spin spinning={retrieveRequestQuantity > 0}>
                <Descriptions
                    title={titleBar}
                    bordered
                    style={{ margin: "10px 0 20px 0" }}
                    column={2}>
                    <Descriptions.Item label={
                        <span>
                            提单人（账号ID）
                            <Tooltip title="查看提单人详细信息">
                                <Link to={`${map.admin.AdminHome()}/customer_management/customers/customer/${order.customer}`}>
                                    <Icon type="info-circle" />
                                </Link>
                            </Tooltip>
                        </span>
                    }>
                        {byOrderCustomers[order.customer].uid}
                    </Descriptions.Item>
                    <Descriptions.Item label="提单人联系方式">{byOrderCustomers[order.customer].contact}</Descriptions.Item>
                    <Descriptions.Item label="地址" span={2}>{byOrderCustomers[order.customer].address}</Descriptions.Item>
                    <Descriptions.Item label="产品" span={2}>
                        {productsDisplay}
                    </Descriptions.Item>
                    <Descriptions.Item label="买家留言">
                        {order.ps}
                    </Descriptions.Item>
                    <Descriptions.Item label="总价">
                        {amountDisplay}
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="单价">
                        {loading ? null :
                            byOrders[orderId].product.price.ingot + "元宝" + byOrders[orderId].product.price.credit + "积分"}
                    </Descriptions.Item>
                    <Descriptions.Item label="总价">214元</Descriptions.Item> */}
                </Descriptions>
                <Modal
                    visible={modalVisible}
                    title={title}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                    footer={[
                        <Button key="back" onClick={this.handleModalCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" loading={modalRequestQuantity} onClick={this.handleModalOk}>
                            确定
                        </Button>,
                    ]}
                >
                    {content}
                </Modal>
            </Spin >
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        // customers: getCustomers(state),
        // byCustomers: getByCustomers(state),
        // customerType: getCustomerType(state),
        // byCustomerType: getByCustomerType(state),
        orders: getOrders(state),
        byOrders: getByOrders(state),
        byOrderActivityRules: getByOrderActivityRules(state),
        byOrderClerks: getByOrderClerks(state),
        byOrderCustomers: getByOrderCustomers(state),
        byOrderProducts: getByProducts(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // ...bindActionCreators(customerActions, dispatch),
        ...bindActionCreators(orderActions, dispatch),
    };
};

const WrappedOrderDetail = Form.create({ name: 'orderDetail' })(OrderDetail);
export default connect(mapStateToProps, mapDispatchToProps)(WrappedOrderDetail);