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
    handleBack = () => {
        window.history.back();
        this.props.setAddButtonVisible();
        // console.log(this.props.match.url);
    }

    setAddButtonInvisible = () => {
        this.props.setAddButtonInvisible();
    }

    render() {
        const { byClerks, match, addButtonVisible } = this.props;
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
                                <ShopView {...props} />} />
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
        byClerks: getClerks(state),
        addButtonVisible: getAddButtonVisible_shopManagement(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(uiActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopManagement);