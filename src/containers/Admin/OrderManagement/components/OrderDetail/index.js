import React from "react";
import { Descriptions, Button, Typography, Col, Row, Spin, Tooltip, Icon, Empty, Modal, Form, Menu, Input } from "antd";
// import { actions as customerActions, getCustomers, getByCustomers,  } from "../../../../../redux/modules/customer";
import { actions as orderActions, getByOrders, getOrders, getByOrderActivityRules, getByOrderClerks, getByOrderCustomers, getByProducts } from "../../../../../redux/modules/order";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { map } from "../../../../../router";
import { sex, fetchOrdersTimeRange, orderStatus, fetchOrderStatus } from "../../../../../utils/common";
import { timeStampConvertToFormatTime } from "../../../../../utils/timeUtil";
import PictureDisplay from "../../../../../components/PictrueDispaly";
import validator from "../../../../../utils/validator";

const { Title } = Typography;

class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderStatus: "",
            modalVisible: false,
            currentModal: "express",
            from: null,
        }
    }

    componentDidMount() {
        const { orderId } = this.props.match.params;
        console.log("this in order detail", this);
        this.props.fetchOrder(orderId).catch(err => {
            this.props.callMessage("error", err);
            const from = this.props.location.state || `${map.admin.AdminHome()}/order_management/orders`;
            this.setState({ from });
        });
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
        let titlBar = null;
        try {
            switch (byOrders[orderId].status.status) {
                case fetchOrderStatus.payed:
                    button = (
                        <span>
                            <Button type="primary" name={fetchOrderStatus.shipped} onClick={this.changeOrderStatus}>发货</Button>
                            &nbsp;&nbsp;
                            <Button name={fetchOrderStatus.refunded} onClick={this.changeOrderStatus}>退款</Button>
                        </span>
                    );
                    break;
                case fetchOrderStatus.requestRefund:
                    button = (
                        <span>
                            <Button type="primary" name={fetchOrderStatus.refunded} onClick={this.changeOrderStatus}>允许退款</Button>
                            &nbsp;&nbsp;
                            <Button name={fetchOrderStatus.rejectRefund} onClick={this.changeOrderStatus}>拒绝退款</Button>
                        </span>
                    );
                    break;
                default:
                    button = null;
            }
            titlBar = (
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
            );
        } catch{
            button = null;
            titlBar = null;
        }
        return titlBar;
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
        try {
            if (order.amount.ingot != 0) {
                display += `${order.amount.ingot}元宝`;
            }
            if (order.amount.credit != 0) {
                display += `${order.amount.credit}积分`;
            }
        } catch{
            display = "";
        }
        return display;
    }

    handleModalCancel = () => {
        this.setState({ modalVisible: false, currentModal: "express" });
        this.setState({ orderStatus: "" });
    }

    handleModalOk = () => {
        const { orderStatus, currentModal } = this.state;
        const { orderId } = this.props.match.params;
        const { byOrders } = this.props;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let params = new Object();
                if (orderStatus == fetchOrderStatus.shipped) {
                    params = { uid: orderId, trackInfo: { ...values } };
                } else if (orderStatus == fetchOrderStatus.refunded || orderStatus == fetchOrderStatus.rejectRefund) {
                    params = { ...values, uid: orderId };
                }
                this.props.updateOrderStatus(orderStatus, params).then(() => {
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
            case fetchOrderStatus.shipped:
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
                                            validator.phone
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
            case fetchOrderStatus.refunded:
                title = "退款说明";
                content = (
                    <span>
                        <strong>确认退款前请先与客户联系确认</strong>
                        <Form>
                            <Form.Item label="退款理由">
                                {getFieldDecorator("sellerPs", {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入退款理由!',
                                        },
                                    ],
                                })(<Input.TextArea rows={4} allowClear />)}
                            </Form.Item>
                        </Form>
                    </span>
                );
                break;
            case fetchOrderStatus.rejectRefund:
                title = "拒绝退款说明";
                content = (
                    <span>
                        <strong>请先与客户联系确认</strong>
                        <Form>
                            <Form.Item label="拒绝退款说明">
                                {getFieldDecorator("sellerPs", {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入说明!',
                                        },
                                    ],
                                })(<Input.TextArea rows={4} allowClear />)}
                            </Form.Item>
                        </Form>
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
        const { from } = this.state;
        if (from != null) {
            return <Redirect to={from} />
        }
        const { match, retrieveRequestQuantity, modalRequestQuantity, orders, byOrders, byOrderProducts, byOrderCustomers, byOrderClerks } = this.props;
        const { orderId } = match.params;
        const { modalVisible } = this.state;
        const order = byOrders[orderId];
        const titleBar = this.getTitleBar();
        let isDataNull = order == undefined;
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
                        isDataNull ? null :
                            <span>
                                提单人（账号ID）
                                <Tooltip title="查看提单人详细信息">
                                    <Link to={`${map.admin.AdminHome()}/customer_management/customers/customer/${order.customer}`}>
                                        <Icon type="info-circle" />
                                    </Link>
                                </Tooltip>
                            </span>
                    }>
                        {isDataNull ? null : byOrderCustomers[order.customer].uid}
                    </Descriptions.Item>
                    <Descriptions.Item label="提单人联系方式">{isDataNull ? null : byOrderCustomers[order.customer].contact}</Descriptions.Item>
                    <Descriptions.Item label="地址" span={2}>{isDataNull ? null : byOrderCustomers[order.customer].address}</Descriptions.Item>
                    <Descriptions.Item label="产品" span={2}>
                        {isDataNull ? null : productsDisplay}
                    </Descriptions.Item>
                    <Descriptions.Item label="买家留言">
                        {isDataNull ? null : order.buyerPs}
                    </Descriptions.Item>
                    {isDataNull ? null : order.status.status != "payed" && order.status.status != "unpayed" ?
                        <Descriptions.Item label={
                            isDataNull ? null :
                                <span>
                                    订单处理人
                                    <Tooltip title="查看订单处理人详细信息">
                                        <Link to={`${map.admin.AdminHome()}/clerk_management/clerks/clerk/${order.clerk}`}>
                                            <Icon type="info-circle" />
                                        </Link>
                                    </Tooltip>
                                </span>
                        }>
                            {isDataNull ? null :byOrderClerks[order.clerk].name}
                        </Descriptions.Item>
                        : null}
                    <Descriptions.Item label="总价">
                        {isDataNull ? null :amountDisplay}
                    </Descriptions.Item>
                </Descriptions>
                {isDataNull ? null : order.trackInfo == null || order.trackInfo == undefined ? null :
                    order.trackInfo.trackingId != null ?
                        <Descriptions bordered title="物流信息" style={{ marginBottom: "20px" }} column={2}>
                            <Descriptions.Item label="物流单号">
                                {order.trackInfo.trackingId}
                            </Descriptions.Item>
                            <Descriptions.Item label="物流公司">
                                {order.trackInfo.companyName}
                            </Descriptions.Item>
                        </Descriptions> :
                        <Descriptions bordered title="物流信息" style={{ marginBottom: "20px" }} column={2}>
                            <Descriptions.Item label="配送人电话">
                                {order.trackInfo.phone}
                            </Descriptions.Item>
                            <Descriptions.Item label="描述信息">
                                {order.trackInfo.Descriptions}
                            </Descriptions.Item>
                        </Descriptions>
                }
                {isDataNull ? null : order.buyerRefundReason != null || order.buyerRefundReason != "" ?
                    <Descriptions bordered title="买家退款理由" style={{ marginBottom: "20px" }}>
                        <Descriptions.Item label="理由">{order.buyerRefundReason}</Descriptions.Item>
                    </Descriptions> : null}
                {isDataNull ? null : order.sellerPs == null || order.sellerPs == "" ? null :
                    <Descriptions bordered title="卖家退款说明" style={{ marginBottom: "20px" }}>
                        <Descriptions.Item label="说明">{order.sellerPs}</Descriptions.Item>
                    </Descriptions>
                }
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