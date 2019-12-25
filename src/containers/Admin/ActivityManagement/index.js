import React from "react";
import { PageHeader, message,Button } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as uiActions } from "../../../redux/modules/ui";
import { Route } from "react-router-dom";
import AddActivity from "./AddActivityForm";


class ActivityManagement extends React.Component {
    handleBack = () => {
        window.history.back();
    }

    getExtra = () => {
        const { history, match } = this.props;
        let extra = null;
        if (history.location.pathname.indexOf("role_detail") != -1) {
            extra = (<Button type="primary" onClick={this.startAlterRoleDetail}>修改职员信息</Button>);
        } else {
            extra = null;
        }
        return extra;
    }

    getSubTitle = () => {
        const { history } = this.props;
        let subTitle = null;
        if (history.location.pathname.indexOf("new_role_detail") != -1) {
            subTitle = "新增职员详情";
        } else {
            subTitle = null;
        }
        return subTitle;
    }


    callMessage = (type = "success", content = "操作成功！") => {
        switch (type) {
            case "success":
                message.success(content);
                break;
            case "error":
                message.error(content);
                break;
            case "warning":
                message.warning(content);
                break;
        }
    }

    render() {
        const subTitle = this.getSubTitle();
        const extra = this.getExtra();
        const { match } = this.props;
        return (
            <div>
                <PageHeader
                    title="活动管理"
                    subTitle={subTitle}
                    onBack={this.handleBack}
                    extra={extra}>
                    <Route
                        path={match.url}
                        exact
                        render={props =>
                            <AddActivity
                                {...props}
                                callMessage={this.callMessage} />
                        }
                    />
                </PageHeader>
            </div>
        )
    }
}


const mapStateToProps = (state, props) => {
    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(uiActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityManagement);