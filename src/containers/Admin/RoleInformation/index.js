import React from "react";
import { PageHeader, Button,message } from "antd";
import { Route, Link } from "react-router-dom";
import RoleList from "./components/RoleList";
import RoleDetail from "../../../components/RoleDetail";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {actions as uiActions} from "../../../redux/modules/ui";
import {actions as clerkActions} from "../../../redux/modules/clerk";
import {actions as shopActions} from "../../../redux/modules/shop";

class RoleInformation extends React.Component {
    // handleBack = () => {
    //     window.history.back();
    // }

    startAlterRoleDetail=()=>{
        this.props.fetchAllAuthority();
        this.props.fetchShopList();
        this.props.fetchAllPosition();
        this.props.startAlterInfo();
    }

    // getExtra = () => {
    //     const { history, match } = this.props;
    //     let extra = null;
    //     if (history.location.pathname.indexOf("role_detail") != -1) {
    //         extra = (<Button type="primary" onClick={this.startAlterRoleDetail }>修改职员信息</Button>);
    //     } else {
    //         extra = null;
    //     }
    //     return extra;
    // }

    // getSubTitle = () => {
    //     const { history } = this.props;
    //     let subTitle = null;
    //     if (history.location.pathname.indexOf("role_detail") != -1) {
    //         subTitle = "职员详情";
    //     } else {
    //         subTitle = null;
    //     }
    //     return subTitle;
    // }

    // callMessage = (type="success", content="操作成功！") => {
    //     switch (type) {
    //         case "success":
    //             message.success(content);
    //             break;
    //         case "error":
    //             message.error(content);
    //             break;
    //         case "warning":
    //             message.warning(content);
    //             break;
    //     }
    // }

    render() {
        const subTitle = this.props.getSubTitle();
        const extra = this.props.getExtra();
        const { match } = this.props;
        return (
            <PageHeader
                title="人员信息管理"
                subTitle={subTitle}
                onBack={this.props.handleBack}
                extra={extra}>
                <Route
                    path={match.url}
                    exact
                    render={props =>
                        <RoleList
                            {...props}
                            // callMessage={this.callMessage} 
                            />
                    }
                />
                <Route
                    path={`${match.url}/role_detail/:clerkId`}
                    exact
                    render={props =>
                        <RoleDetail
                            {...props}
                            // callMessage={this.callMessage} 
                        />
                    }
                />
            </PageHeader>
        );
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
export default connect(mapStateToProps,mapDispatchToProps)(RoleInformation);