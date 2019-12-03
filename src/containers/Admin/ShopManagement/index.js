import React from "react";
import { Select, PageHeader } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getShop, getShopList } from "../../../redux/modules/shop";
import { getClerks } from "../../../redux/modules/clerk";
import ShopView from "./components/ShopView";
import { Route } from "react-router-dom";
import { getError, getRequestQuantity } from "../../../redux/modules/app";
import { actions as uiActions, getShopId_shopManagement } from "../../../redux/modules/ui";
import ClerkView from "./components/ClerkView";


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

    render() {
        const { shopList, shopInfo } = this.props.shop;
        const { shopListInArray, byClerks, requestQuantity, error, match, shopId } = this.props;
        return (
            <div>
                <PageHeader
                    title="门店管理"
                    onBack={() => window.history.back()}>
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
                                    onChange={this.onChange}
                                    byClerks={byClerks}
                                    shopInfo={shopInfo} />} />
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(shopActions, dispatch),
        ...bindActionCreators(uiActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopManagement);