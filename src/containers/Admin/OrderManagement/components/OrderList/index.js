// import React from "react";
// import { Descriptions, Button, Typography, Menu, Icon, Spin } from "antd";
// // import { actions as customerActions, getCustomers, getByCustomers, getByCustomerType, getCustomerType } from "../../../../../redux/modules/customer";
// import { actions as orderActions, getByOrders, getOrders } from "../../../../../redux/modules/order";
// import { bindActionCreators } from "redux";
// import { connect } from "react-redux";
// import { sex, fetchOrdersTimeRange } from "../../../../../utils/common";
// import OrderListCompent from "../../../../../components/OrderList";

// const { Title } = Typography;

// class OrderList extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {

//         }
//     }

//     componentDidMount() {
//         this.props.fetchOrders();
//     }

//     fetchAllOrders = () => {
//         this.props.fetchOrders(fetchOrdersTimeRange["all"]);
//     }

//     fetchOrdersTimeRange = (timeRange) => {
//         this.props.fetchOrders(timeRange);
//     }

//     render() {
//         const { requestQuantity, orders, byOrders } = this.props;
//         return (
//             <Spin spinning={requestQuantity > 0}>
//                 <span>当前为最近3个月的申请数据</span>
//                 <Button type="link" onClick={this.fetchAllOrders}>加载所有订单数据</Button>
//                 <OrderListCompent
//                     orders={orders}
//                     byOrders={byOrders}
//                     deleteOrdersByBatch={(orders) => this.props.deleteOrdersByBatch(orders)}
//                     fetchOrdersTimeRange={this.fetchOrdersTimeRange}
//                     callMessage={this.props.callMessage}
//                     deleteOrder={this.props.deleteOrder}
//                 />
//             </Spin>
//         );
//     }
// }

// const mapStateToProps = (state, props) => {
//     return {
//         // customers: getCustomers(state),
//         // byCustomers: getByCustomers(state),
//         // customerType: getCustomerType(state),
//         // byCustomerType: getByCustomerType(state),
//         orders: getOrders(state),
//         byOrders: getByOrders(state),
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//         // ...bindActionCreators(customerActions, dispatch),
//         ...bindActionCreators(orderActions, dispatch),
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(OrderList);