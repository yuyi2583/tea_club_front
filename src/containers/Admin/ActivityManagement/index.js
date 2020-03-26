import React from "react";
import { PageHeader, message, Button } from "antd";
// import { bindActionCreators } from "redux";
// import { connect } from "react-redux";
// import { actions as productActions, getProductType, getByProductType } from "../../../redux/modules/product";
// import { actions as customerActions, getCustomerType, getByCustomerType } from "../../../redux/modules/customer";
import { Route } from "react-router-dom";
// import ActivityDetail from "./ActivityDetail";
import ActivityList from "./ActivityList";


function ActivityManagement(props) {

    // startAlterActivityDetail = () => {
    //     this.props.startAlterInfo();
    // }

    // componentDidMount() {
    //     this.props.fetchProductType();
    //     this.props.fetchCustomerType();
    //     const { history } = this.props;
    //     console.log("history in activity management", history);
    // }
    // render() {
    const subTitle = props.getSubTitle();
    const extra = props.getExtra();
    const { match, productType, byCustomerType, customerType, byProductType } = props;
    const prop = props;
    return (
        <div>
            <PageHeader
                title="活动管理"
                subTitle={subTitle}
                onBack={props.handleBack}
                extra={extra}>
                <Route
                    path={match.url}
                    exact
                    render={props =>
                        <ActivityList
                            {...prop}
                            {...props}
                        />
                    }
                />
                {/* <Route
                        path={`${match.url}/activity/:activityId`}
                        exact
                        render={props =>
                            <ActivityDetail
                                {...props}
                                {...this.props}
                                productType={productType}
                                byProductType={byProductType}
                                customerType={customerType}
                                byCustomerType={byCustomerType}
                            />
                        }
                    /> */}
            </PageHeader>
        </div>
    )
    // }
}


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
//         ...bindActionCreators(productActions, dispatch),
//         ...bindActionCreators(customerActions, dispatch),
//     };
// };

export default ActivityManagement;// connect(mapStateToProps, mapDispatchToProps)(ActivityManagement);