import React from "react";
import { PageHeader } from "antd";
import { Route } from "react-router-dom";
// import ArticleDetail from "./components/ArticleDetail";
import ArticleList from "./components/ArticleList";


function ArticleManagement(props) {

    const subTitle = props.getSubTitle();
    const extra = props.getExtra();
    const { match } = props;
    const prop = props;
    return (
        <div>
            <PageHeader
                title="文章管理"
                subTitle={subTitle}
                onBack={props.handleBack}
                extra={extra}>
                <Route
                    path={match.url}
                    exact
                    render={props =>
                        <ArticleList
                            {...prop}
                            {...props}
                        />
                    }
                />
                {/* <Route
                    path={`${match.url}/activity/:activityId`}
                    exact
                    render={props =>
                        <ArticleDetail
                            {...prop}
                            {...props}
                        />
                    }
                /> */}
            </PageHeader>
        </div>
    )
}

export default ArticleManagement;