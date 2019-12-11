import React from "react";
import { Select, PageHeader, Tooltip, Icon, Button, message } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getByClerks } from "../../../redux/modules/clerk";
import ShopView from "./components/ShopView";
import { Route, Link } from "react-router-dom";
import {
    actions as uiActions,
    getAlterInfoState
} from "../../../redux/modules/ui";
import ClerkView from "./components/ClerkView";
import AddShop from "./components/AddShop";
import BoxView from "./components/BoxView";
import AddBox from "./components/AddBox";


class ShopManagement extends React.Component {
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

    callMessage = (type, content) => {
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

    getSubTitle = () => {
        const { history } = this.props;
        let subTitle = null;
        if (history.location.pathname.indexOf("addShop") != -1) {
            subTitle = "新增门店";
        } else if (history.location.pathname.indexOf("boxInfo") != -1) {
            subTitle = "包厢信息";
        } else if(history.location.pathname.indexOf("addBox") != -1){
            subTitle="新增包厢";
        }else if(history.location.pathname.indexOf("clerkDetail") != -1){
            subTitle="职员信息";
        }else {
            subTitle = null;
        }
        return subTitle;
    }

    render() {
        const { byClerks, match, addButtonVisible, history, alterInfo } = this.props;
        const extra = this.getExtra();
        const subTitle = this.getSubTitle();
        return (
            <div>
                <PageHeader
                    title="门店管理"
                    subTitle={subTitle}
                    onBack={this.handleBack}
                    extra={extra}>
                    <div>
                        <Route
                            path={match.url}
                            exact
                            render={props =>
                                <ShopView
                                    {...props}
                                    callMessage={this.callMessage} />
                            } />
                        <Route
                            path={`${match.url}/addShop`}//TODO
                            render={props =>
                                <AddShop
                                    {...props}
                                    callMessage={this.callMessage} />
                            } />
                        <Route
                            path={`${match.url}/boxInfo/:shopId/:boxId`}
                            render={props =>
                                <BoxView
                                    {...props}
                                    callMessage={this.callMessage}
                                    alterInfo={alterInfo} />
                            } />
                        <Route
                            path={`${match.url}/addBox/:shopId`}
                            render={props =>
                                <AddBox
                                    {...props}
                                    callMessage={this.callMessage} />
                            } />
                        <Route
                            path={`${match.url}/clerkDetail/:shopId/:clerkId`}
                            render={(props) => (
                                <ClerkView
                                    {...props}
                                    byClerks={byClerks}
                                    callMessage={this.callMessage} />
                            )} />
                    </div>
                </PageHeader>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        byClerks: getByClerks(state),
        alterInfo: getAlterInfoState(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(uiActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopManagement);