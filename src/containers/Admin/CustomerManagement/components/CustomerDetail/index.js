import React from "react";
import { Descriptions, Button, Typography, Menu, Icon, Spin } from "antd";
import { actions as customerActions, getCustomers, getByCustomers, getByCustomerType, getCustomerType } from "../../../../../redux/modules/customer";
import { actions as orderActions, getByOrders, getOrders } from "../../../../../redux/modules/order";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { sex, fetchOrdersTimeRange } from "../../../../../utils/common";
import OrderList from "../../../../../components/OrderList";

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
        this.props.fetchCustomerById(customerId);
    }

    handleClickMenu = e => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    };

    fetchAllOrderByCustomer = () => {
        const { customerId } = this.props.match.params;
        this.props.fetchOrdersByCustomer(customerId, fetchOrdersTimeRange["all"]);
    }

    fetchOrdersByCustomerAndTimeRange=(timeRange)=>{
        const { customerId } = this.props.match.params;
        this.props.fetchOrdersByCustomer(customerId, timeRange);
    }

    render() {
        const { byCustomers, match, customers, requestQuantity,
            customerType, byCustomerType, orders, byOrders } = this.props;
        if (customers.length == 0) {
            this.props.fetchAllCustomers();
        }
        if (customerType.length == 0) {
            this.props.fetchCustomerType();
        }
        const { customerId } = match.params;
        console.log(customerId + "'s detail", byCustomers[customerId]);
        const { current } = this.state;
        return (
            <Spin spinning={requestQuantity > 0}>
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
                            <Descriptions.Item label="姓名">{byCustomers[customerId].name}</Descriptions.Item>
                            <Descriptions.Item label="性别">{sex[byCustomers[customerId].sex]}</Descriptions.Item>
                            <Descriptions.Item label="联系方式">{byCustomers[customerId].contact}</Descriptions.Item>
                            <Descriptions.Item label="邮箱">{byCustomers[customerId].email}</Descriptions.Item>
                            <Descriptions.Item label="客户类型">{byCustomerType[byCustomers[customerId].customerType].name}</Descriptions.Item>
                            <Descriptions.Item label="地址">{byCustomers[customerId].address}</Descriptions.Item>
                        </Descriptions> :
                        <div>
                            <span>当前为最近3个月的申请数据</span>
                            <Button type="link" onClick={this.fetchAllOrderByCustomer}>加载所有订单数据</Button>
                            <OrderList
                                orders={orders}
                                byOrders={byOrders}
                                deleteOrdersByBatch={(orders)=>this.props.deleteOrdersByBatch(orders)}
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);