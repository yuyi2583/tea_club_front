import React from "react";
import { PageHeader } from "antd";
import { Route } from "react-router-dom";
import OrderList from "./components/OrderList";
import OrderDetail from "./components/OrderDetail";


class OrderManagement extends React.Component {

    render() {
        const subTitle = this.props.getSubTitle();
        const extra = this.props.getExtra();
        const { match } = this.props;
        return (
            <div>
                <PageHeader
                    title="订单管理"
                    subTitle={subTitle}
                    onBack={this.props.handleBack}
                    extra={extra}>
                    <Route
                        path={match.url}
                        exact
                        render={props =>
                            <OrderList {...this.props} {...props} />
                        }
                    />
                    <Route
                        path={`${match.url}/order/:orderId`}
                        exact
                        render={props =>
                            <OrderDetail
                                {...this.props}
                                {...props}
                            />
                        }
                    />
                </PageHeader>
            </div>
        )
    }
}


export default OrderManagement;