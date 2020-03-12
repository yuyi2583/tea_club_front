import React from "react";
import { Descriptions, Button, Typography, Col, Row, Spin } from "antd";
import { actions as customerActions, getCustomers, getByCustomers, getByCustomerType, getCustomerType } from "../../../../../redux/modules/customer";
import { actions as orderActions, getByOrders, getOrders } from "../../../../../redux/modules/order";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { sex, fetchOrdersTimeRange } from "../../../../../utils/common";
import { timeStampConvertToFormatTime } from "../../../../../utils/timeUtil";
import PictureCard from "../../../../../components/PictureCard";

const { Title } = Typography;

class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        const { orderId } = this.props.match.params;
        this.props.fetchOrderById(orderId);
        // this.props.fetchCustomerById(customerId);
    }

    getFileList = (item) => {
        return item != null ? [{
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: item,
        }] : [];
    }

    getData = () => {
        const { match, requestQuantity, orders, byOrders } = this.props;
        const { orderId } = match.params;
        // let orderTime=null,fileListInProps=new Array(),name=null,ingot=null,credit=null,number=null;
    }

    getTitleBar = () => {
        const { match, requestQuantity, orders, byOrders } = this.props;
        const { orderId } = match.params;
        return (
            <Row>
                <Col span={12}>{timeStampConvertToFormatTime(byOrders[orderId].orderTime)}    订单编号:{orderId}</Col>
                <Col span={12} style={{display:"flex",justifyContent:"flex-end"}}>
                    <Button>删除订单</Button>
                    <Button>接单</Button>
                    
                </Col>
            </Row>
        )
    }

    render() {
        const { match, requestQuantity, orders, byOrders } = this.props;
        const { orderId } = match.params;
        const fileListInProps = this.getFileList(byOrders[orderId].picture);
        let loading = false;
        const titleBar=this.getTitleBar();
        try {
            const { price } = byOrders[orderId].product;
            const { ingot, credit } = price;
            const { activityRule } = byOrders[orderId].activity;
        } catch{
            loading = true;
        }
        return (
            <Spin spinning={requestQuantity > 0}>
                <Descriptions
                    title={titleBar}
                    bordered
                    style={{ marginTop: "10px" }}
                    column={16}
                    layout="vertical">
                    <Descriptions.Item label="产品" span={12}>
                        <Row>
                            <Col span={12}>
                                <PictureCard
                                    fileList={fileListInProps}
                                    max={1} />
                            </Col>
                            <Col span={12}>{byOrders[orderId].product.name}</Col>
                        </Row>
                    </Descriptions.Item>
                    <Descriptions.Item label="单价">
                        {loading ? null :
                            byOrders[orderId].product.price.ingot + "元宝" + byOrders[orderId].product.price.credit + "积分"}
                    </Descriptions.Item>
                    <Descriptions.Item label="数量">{byOrders[orderId].number}</Descriptions.Item>
                    <Descriptions.Item label="优惠">{loading ? null : "满" + byOrders[orderId].activity.activityRule.activityInReduction1 + "减" + byOrders[orderId].activity.activityRule.activityInReduction2}</Descriptions.Item>
                    <Descriptions.Item label="状态">{byOrders[orderId].status}</Descriptions.Item>
                    <Descriptions.Item label="地址" span={12}>{byOrders[orderId].address}</Descriptions.Item>
                    <Descriptions.Item label="提单人（账号ID）">{byOrders[orderId].address}</Descriptions.Item>
                    <Descriptions.Item label="提单人联系方式">{byOrders[orderId].address}</Descriptions.Item>
                    <Descriptions.Item><Button>查看提单人详细信息</Button></Descriptions.Item>
                    {/* <Descriptions.Item label="总价">214元</Descriptions.Item> */}
                </Descriptions>
            </Spin >
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        customers: getCustomers(state),
        byCustomers: getByCustomers(state),
        customerType: getCustomerType(state),
        byCustomerType: getByCustomerType(state),
        orders: getOrders(state),
        byOrders: getByOrders(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(customerActions, dispatch),
        ...bindActionCreators(orderActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);