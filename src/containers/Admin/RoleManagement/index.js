import React from "react";
import { PageHeader ,Button} from "antd";
import { Route,Link } from "react-router-dom";
import RoleList from "./components/RoleList";

class RoleManagement extends React.Component {
    handleBack = () => {
        window.history.back();
    }

    getExtra = () => {
        const { history, match } = this.props;
        let extra = null;
        if (history.location.pathname === "/administrator/company/shop_management") {
            extra = (
                <Link to={`${match.url}/addShop`}>
                    <Button type="primary">新增门店</Button>
                </Link>);
        } else if (history.location.pathname.indexOf("boxInfo") != -1) {
            extra = (<Button type="primary" onClick={() => this.props.startAlterInfo()}>修改包厢信息</Button>);
        } else {
            extra = null;
        }
        return extra;
    }

    getSubTitle = () => {
        const { history } = this.props;
        let subTitle = null;
        if (history.location.pathname.indexOf("addShop") != -1) {
            subTitle = "新增门店";
        } else if (history.location.pathname.indexOf("boxInfo") != -1) {
            subTitle = "包厢信息";
        } else if (history.location.pathname.indexOf("addBox") != -1) {
            subTitle = "新增包厢";
        } else if (history.location.pathname.indexOf("clerkDetail") != -1) {
            subTitle = "职员信息";
        } else {
            subTitle = null;
        }
        return subTitle;
    }

    render() {
        const subTitle = this.getSubTitle();
        const extra = this.getExtra();
        const { match } = this.props;
        return (
            <PageHeader
                title="人员信息管理"
                subTitle={subTitle}
                onBack={this.handleBack}
                extra={extra}>
                <Route
                    path={match.url}
                    exact
                    render={props =>
                        <RoleList
                            {...props}/>
                    } />
            </PageHeader>
        );
    }
}

export default RoleManagement;