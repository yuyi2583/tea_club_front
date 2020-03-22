import React from "react";
import { PageHeader } from "antd";
import { Route } from "react-router-dom";
import ClerkList from "./components/ClerkList";
import ClerkDetail from "./components/ClerkDetail";

class ClerkManagement extends React.Component {

    render() {
        const subTitle = this.props.getSubTitle();
        const extra = this.props.getExtra();
        const { match } = this.props;
        return (
            <PageHeader
                title="职员管理"
                subTitle={subTitle}
                onBack={this.props.handleBack}
                extra={extra}>
                <Route
                    path={match.url}
                    exact
                    render={props =>
                        <ClerkList
                            {...this.props}
                            {...props}
                        />
                    }
                />
                <Route
                    path={`${match.url}/clerk/:clerkId`}
                    exact
                    render={props =>
                        <ClerkDetail
                            {...this.props}
                            {...props}
                        />
                    }
                />
            </PageHeader>
        );
    }
}

export default ClerkManagement;