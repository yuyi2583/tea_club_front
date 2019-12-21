import React from "react";
import { PageHeader, Button, message } from "antd";
import { Route } from "react-router-dom";
import AddRoleForm from "./components/AddRoleForm";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import RoleDetail from "../../../components/RoleDetail";
import { actions as uiActions } from "../../../redux/modules/ui";
import { actions as shopActions } from "../../../redux/modules/shop";
import { actions as clerkActions } from "../../../redux/modules/clerk";

class AddRole extends React.Component {
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


    startAlterRoleDetail = () => {
        this.props.fetchAllAuthority();
        this.props.fetchShopList();
        this.props.fetchAllPosition();
        this.props.startAlterInfo();
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
                    title="新增人员"
                    subTitle={subTitle}
                    onBack={this.handleBack}
                    extra={extra}>
                    <Route
                        path={match.url}
                        exact
                        render={props =>
                            <AddRoleForm
                                {...props}
                                callMessage={this.callMessage} />
                        }
                    />
                    <Route
                        path={`${match.url}/new_role_detail/:clerkId`}
                        render={props =>
                            <RoleDetail
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
        ...bindActionCreators(clerkActions, dispatch),
        ...bindActionCreators(shopActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddRole);