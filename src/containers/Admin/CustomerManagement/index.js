import React from "react";
import { PageHeader } from "antd";
import { Route } from "react-router-dom";
import CustomerList from "./components/CustomerList";
import CustomerDetail from "./components/CustomerDetail";


class CustomerManagement extends React.Component {

    render() {
        const subTitle = this.props.getSubTitle();
        const extra = this.props.getExtra();
        const { match } = this.props;
        return (
            <div>
                <PageHeader
                    title="客户管理"
                    subTitle={subTitle}
                    onBack={this.props.handleBack}
                    extra={extra}>
                    <Route
                        path={match.url}
                        exact
                        render={props =>
                            <CustomerList {...this.props} {...props} />
                        }
                    />
                    <Route
                        path={`${match.url}/customer/:customerId`}
                        exact
                        render={props =>
                            <CustomerDetail
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


export default CustomerManagement;