import React from "react";
import { PageHeader } from "antd";
import { Route } from "react-router-dom";
import ActivityDetail from "./components/ActivityDetail";
import ActivityList from "./components/ActivityList";


function ActivityManagement(props) {

    const subTitle = props.getSubTitle();
    const extra = props.getExtra();
    const { match } = props;
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
                <Route
                    path={`${match.url}/activity/:activityId`}
                    exact
                    render={props =>
                        <ActivityDetail
                            {...prop}
                            {...props}
                        />
                    }
                />
            </PageHeader>
        </div>
    )
}

export default ActivityManagement;