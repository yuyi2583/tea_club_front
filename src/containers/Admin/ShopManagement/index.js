import React from "react";
import { Select, PageHeader, Tooltip, Icon, Button } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getShop, getShopList, getBoxesInArray,getDisplay } from "../../../redux/modules/shop";
import { getClerks } from "../../../redux/modules/clerk";
import ShopView from "./components/ShopView";
import { Route, Link } from "react-router-dom";
import { getError, getRequestQuantity } from "../../../redux/modules/app";
import {
    actions as uiActions,
    getShopId_shopManagement,
    getAddButtonVisible_shopManagement,
    getAlterInfoState
} from "../../../redux/modules/ui";
import ClerkView from "./components/ClerkView";
import AddShop from "./components/AddShop";


const { Option } = Select;

class ShopManagement extends React.Component {
    onChange = (value) => {
        this.props.fetchShopInfo(value);
        this.props.selectShop_shopManagement(value);
    }

    componentDidMount() {
        this.props.fetchShopList();
    }

    componentWillUnmount() {
        this.props.selectShop_shopManagement("请选择门店");
    }

    handleBack = () => {
        window.history.back();
        this.props.setAddButtonVisible();
        // console.log(this.props.match.url);
    }

    setAddButtonInvisible = () => {
        this.props.setAddButtonInvisible();
    }

    startAlterInfo=()=>{
        this.props.startAlterInfo()
    }

    finishAlterInfo=()=>{
        this.props.finishAlterInfo();
    }

    handleRemoveClerk=(clerkId)=>{
        this.props.removeShopClerk(clerkId);
    }

    setDisplay=(display)=>{
        this.props.setDisplay(display);
    }

    render() {
        const { shopList, shopInfo } = this.props.shop;
        const { shopListInArray, byClerks, requestQuantity, error, match, shopId, addButtonVisible, boxes,alterInfo,byDisplay } = this.props;
        return (
            <div>
                <PageHeader
                    title="门店管理"
                    onBack={this.handleBack}
                    extra={!addButtonVisible ? null :
                        <Link to={`${match.url}/addShop`}><Button type="primary" onClick={this.setAddButtonInvisible}>新增门店</Button></Link>
                    }>
                    <div>
                        <Route
                            path={match.url}
                            exact
                            render={props =>
                                <ShopView
                                    {...props}
                                    shopListInArray={shopListInArray}
                                    requestQuantity={requestQuantity}
                                    shopId={shopId}
                                    byDisplay={byDisplay}
                                    setDisplay={this.setDisplay}
                                    handleRemoveClerk={this.handleRemoveClerk}
                                    alterInfo={alterInfo}
                                    startAlterInfo={this.startAlterInfo}
                                    finishAlterInfo={this.finishAlterInfo}
                                    handleClickClerk={this.setAddButtonInvisible}
                                    onChange={this.onChange}
                                    boxesInArray={boxes}
                                    byClerks={byClerks}
                                    shopInfo={shopInfo} />} />
                        <Route
                            path={`${match.url}/addShop`}
                            render={props =>
                                <AddShop {...props} />
                            } />
                        <Route
                            path={`${match.url}/:shopId/:clerkId`}
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
        shop: getShop(state),
        shopListInArray: getShopList(state),
        byClerks: getClerks(state),
        requestQuantity: getRequestQuantity(state),
        error: getError(state),
        shopId: getShopId_shopManagement(state),
        addButtonVisible: getAddButtonVisible_shopManagement(state),
        boxes: getBoxesInArray(state),
        alterInfo:getAlterInfoState(state),
        byDisplay:getDisplay(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(shopActions, dispatch),
        ...bindActionCreators(uiActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopManagement);