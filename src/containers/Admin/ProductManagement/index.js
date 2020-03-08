import React from "react";
import { PageHeader } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as productActions, getProductType, getByProductType } from "../../../redux/modules/product";
import { actions as customerActions, getCustomerType, getByCustomerType } from "../../../redux/modules/customer";
import { Route } from "react-router-dom";
// import ActivityDetail from "./ActivityDetail";
import ProductList from "./components/ProductList";


class ProductManagement extends React.Component {

    render() {
        const subTitle = this.props.getSubTitle();
        const extra = this.props.getExtra();
        const { match,productType,byCustomerType,customerType,byProductType } = this.props;
        return (
            <div>
                <PageHeader
                    title="产品管理"
                    subTitle={subTitle}
                    onBack={this.props.handleBack}
                    extra={extra}>
                    <Route
                        path={match.url}
                        exact
                        render={props =>
                            <ProductList {...props} {...this.props} />
                        }
                    />
                    <Route
                        path={`${match.url}/product/:productId`}
                        exact
                        // render={props =>
                        //     <ActivityDetail
                        //         {...props}
                        //         productType={productType}
                        //         byProductType={byProductType}
                        //         customerType={customerType}
                        //         byCustomerType={byCustomerType}
                        //         // callMessage={this.callMessage}
                        //     />
                        // }
                    />
                </PageHeader>
            </div>
        )
    }
}


const mapStateToProps = (state, props) => {
    return {
        productType: getProductType(state),
        byProductType: getByProductType(state),
        customerType: getCustomerType(state),
        byCustomerType: getByCustomerType(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(productActions, dispatch),
        ...bindActionCreators(customerActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductManagement);