import React from "react";
import { Select, PageHeader, Tooltip, Icon, Button } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getClerks } from "../../../redux/modules/clerk";
import ShopView from "./components/ShopView";
import { Route, Link } from "react-router-dom";
import {
    actions as uiActions,
    getAlterInfoState
} from "../../../redux/modules/ui";
import ClerkView from "./components/ClerkView";
import AddShop from "./components/AddShop";
import BoxView from "./components/BoxView";


class ShopManagement extends React.Component {
    handleBack = () => {
        window.history.back();
    }

    getExtra = () => {
        const { history,match } = this.props;
        let extra = null;
        if(history.location.pathname === "/administrator/company/shop_management"){
            extra = (
                <Link to={`${match.url}/addShop`}>
                    <Button type="primary">新增门店</Button>
                </Link>);
        }else if(history.location.pathname.indexOf("boxInfo")!=-1){
            extra=(<Button type="primary" onClick={()=>this.props.startAlterInfo()}>修改包厢信息</Button>);
        }else{
            extra=null;
        }
        return extra;
    }

    render() {
        const { byClerks, match, addButtonVisible, history,alterInfo } = this.props;
        const extra = this.getExtra();
        return (
            <div>
                <PageHeader
                    title="门店管理"
                    onBack={this.handleBack}
                    extra={extra}>
                    <div>
                        <Route
                            path={match.url}
                            exact
                            render={props =>
                                <ShopView {...props} />} />
                        <Route
                            path={`${match.url}/addShop`}
                            render={props =>
                                <AddShop {...props} />
                            } />
                        <Route
                            path={`${match.url}/boxInfo/:shopId/:boxId`}
                            render={props =>
                                <BoxView 
                                    {...props} 
                                    alterInfo={alterInfo}/>
                            } />
                        <Route
                            path={`${match.url}/clerkDetail/:shopId/:clerkId`}
                            render={(props) => (
                                <ClerkView {...props} byClerks={byClerks} />
                            )} />
                    </div>
                </PageHeader>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        byClerks: getClerks(state),
        alterInfo:getAlterInfoState(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(uiActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopManagement);