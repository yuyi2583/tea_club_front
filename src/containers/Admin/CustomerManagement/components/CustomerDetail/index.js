import React from "react";
import { Descriptions, Button, Typography, Menu, Icon, Spin } from "antd";
// import { actions as customerActions, getCustomers, getByCustomers } from "../../../../../redux/modules/customer";
import { actions as orderActions, getByOrders, getOrders, getByOrderActivityRules, getByOrderClerks, getByOrderCustomers, getByProducts } from "../../../../../redux/modules/order";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { sex, fetchTimeRange } from "../../../../../utils/common";
import OrderList from "./components/OrderList";
import PictureDispaly from "../../../../../components/PictrueDispaly";

const { Title } = Typography;

class CustomerDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'detail',
        }
    }

    componentDidMount() {
        const { customerId } = this.props.match.params;
        this.props.fetchOrdersByCustomer(customerId);
        // this.props.fetchCustomerById(customerId);
    }

    handleClickMenu = e => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    };

    fetchAllOrderByCustomer = () => {
        const { customerId } = this.props.match.params;
        this.props.fetchOrdersByCustomer(customerId, fetchTimeRange["all"]());
    }

    fetchOrdersByCustomerAndTimeRange = (timeRange) => {
        const { customerId } = this.props.match.params;
        this.props.fetchOrdersByCustomer(customerId, timeRange);
    }

    render() {
        const { match, retrieveRequestQuantity, orders, byOrders, byOrderActivityRules, byOrderClerks, byOrderCustomers, byProducts } = this.props;
        // if (customers.length == 0) {
        //     this.props.fetchAllCustomers();
        // }
        // if (customerType.length == 0) {
        //     this.props.fetchCustomerType();
        // }
        const { customerId } = match.params;
        const { current } = this.state;
        let isDataNull = true;
        if (byOrderCustomers[customerId] != undefined && byOrderCustomers[customerId].avatar != null) {
            isDataNull = false;
        }
        return (
            <Spin spinning={retrieveRequestQuantity > 0}>
                <Menu onClick={this.handleClickMenu} selectedKeys={[this.state.current]} mode="horizontal">
                    <Menu.Item key="detail">
                        <Icon type="mail" />
                        客户信息详情
                    </Menu.Item>
                    <Menu.Item key="orderRecord">
                        <Icon type="appstore" />
                        订单记录
                    </Menu.Item>
                </Menu>
                {
                    current == "detail" ?
                        <Descriptions title={`客户编号:${customerId}`} bordered style={{ marginTop: "10px" }}>
                            <Descriptions.Item label="姓名">{isDataNull ? null : byOrderCustomers[customerId].name}</Descriptions.Item>
                            <Descriptions.Item label="性别">{isDataNull ? null : sex[byOrderCustomers[customerId].gender]}</Descriptions.Item>
                            <Descriptions.Item label="联系方式">{isDataNull ? null : byOrderCustomers[customerId].contact}</Descriptions.Item>
                            <Descriptions.Item label="邮箱">{isDataNull ? null : byOrderCustomers[customerId].email}</Descriptions.Item>
                            <Descriptions.Item label="客户类型">{isDataNull ? null : byOrderCustomers[customerId].customerType.name}</Descriptions.Item>
                            <Descriptions.Item label="地址">{isDataNull ? null : byOrderCustomers[customerId].address}</Descriptions.Item>
                            <Descriptions.Item label="客户头像">{isDataNull ? null : <PictureDispaly photo={byOrderCustomers[customerId].avatar.photo} />}</Descriptions.Item>
                        </Descriptions> :
                        <div>
                            <span>当前为最近3个月的申请数据</span>
                            <Button type="link" onClick={this.fetchAllOrderByCustomer}>加载所有订单数据</Button>
                            <OrderList
                                orders={orders}
                                byOrders={byOrders}
                                byOrderActivityRules={byOrderActivityRules}
                                byOrderClerks={byOrderClerks}
                                byProducts={byProducts}
                                deleteOrdersByBatch={(orders) => this.props.deleteOrdersByBatch(orders)}
                                fetchOrdersTimeRange={this.fetchOrdersByCustomerAndTimeRange}
                                callMessage={this.props.callMessage}
                                deleteOrder={this.props.deleteOrder}
                            />
                        </div>
                }
            </Spin>
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
        byProducts: getByProducts(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // ...bindActionCreators(customerActions, dispatch),
        ...bindActionCreators(orderActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);