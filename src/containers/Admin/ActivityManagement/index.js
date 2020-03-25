// import React from "react";
// import { PageHeader, message, Button } from "antd";
// import { bindActionCreators } from "redux";
// import { connect } from "react-redux";
// import { actions as uiActions } from "../../../redux/modules/ui";
// import { actions as productActions, getProductType, getByProductType } from "../../../redux/modules/product";
// import { actions as customerActions, getCustomerType, getByCustomerType } from "../../../redux/modules/customer";
// import { Route } from "react-router-dom";
// import ActivityDetail from "./ActivityDetail";
// import ActivityList from "./ActivityList";


// class ActivityManagement extends React.Component {
//     // handleBack = () => {
//     //     window.history.back();
//     // }

//     // getExtra = () => {
//     //     const { history, match } = this.props;
//     //     let extra = null;
//     //     if (history.location.pathname.indexOf("/activity/") != -1) {
//     //         extra = (<Button type="primary" onClick={this.startAlterActivityDetail}>修改活动信息</Button>);
//     //     } else {
//     //         extra = null;
//     //     }
//     //     return extra;
//     // }

//     startAlterActivityDetail = () => {
//         this.props.startAlterInfo();
//     }

//     // getSubTitle = () => {
//     //     const { history } = this.props;
//     //     let subTitle = null;
//     //     if (history.location.pathname.indexOf("new_role_detail") != -1) {
//     //         subTitle = "新增职员详情";
//     //     } else {
//     //         subTitle = null;
//     //     }
//     //     return subTitle;
//     // }


//     // callMessage = (type = "success", content = "操作成功！") => {
//     //     switch (type) {
//     //         case "success":
//     //             message.success(content);
//     //             break;
//     //         case "error":
//     //             message.error(content);
//     //             break;
//     //         case "warning":
//     //             message.warning(content);
//     //             break;
//     //     }
//     // }

//     componentDidMount() {
//         this.props.fetchProductType();
//         this.props.fetchCustomerType();
//         const { history } = this.props;
//         console.log("history in activity management", history);
//     }
//     render() {
//         const subTitle = this.props.getSubTitle();
//         const extra = this.props.getExtra();
//         const { match, productType, byCustomerType, customerType, byProductType } = this.props;
//         return (
//             <div>
//                 <PageHeader
//                     title="活动管理"
//                     subTitle={subTitle}
//                     onBack={this.props.handleBack}
//                     extra={extra}>
//                     <Route
//                         path={match.url}
//                         exact
//                         render={props =>
//                             <ActivityList
//                                 {...props}
//                                 {...this.props}
//                             />
//                         }
//                     />
//                     <Route
//                         path={`${match.url}/activity/:activityId`}
//                         exact
//                         render={props =>
//                             <ActivityDetail
//                                 {...props}
//                                 {...this.props}
//                                 productType={productType}
//                                 byProductType={byProductType}
//                                 customerType={customerType}
//                                 byCustomerType={byCustomerType}
//                             />
//                         }
//                     />
//                 </PageHeader>
//             </div>
//         )
//     }
// }


// const mapStateToProps = (state, props) => {
//     return {
//         productType: getProductType(state),
//         byProductType: getByProductType(state),
//         customerType: getCustomerType(state),
//         byCustomerType: getByCustomerType(state),
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//         ...bindActionCreators(uiActions, dispatch),
//         ...bindActionCreators(productActions, dispatch),
//         ...bindActionCreators(customerActions, dispatch),
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(ActivityManagement);