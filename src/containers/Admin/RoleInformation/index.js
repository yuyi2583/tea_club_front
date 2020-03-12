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

    startAlterRoleDetail=()=>{
        this.props.fetchAllAuthority();
        this.props.fetchShopList();
        this.props.fetchAllPosition();
        this.props.startAlterInfo();
    }

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