import React from "react";
import { Select, Empty, Spin } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getShop, getShopList } from "../../../redux/modules/shop";
import { getClerks } from "../../../redux/modules/clerk";
import ShopInfo from "./components/ShopInfo";
import { Switch, Route, Link } from "react-router-dom";
import PageHeader from "../../../components/AdminPageHeader";
import { getError, getRequestQuantity } from "../../../redux/modules/app";
import { actions as uiActions, getShopId_shopManagement } from "../../../redux/modules/ui";


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
                    title="门店管理">
                    <div>
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            optionFilterProp="children"
                            defaultValue={shopId ? shopId : "请选择门店"}
                            onChange={this.onChange}
                            filterOption={(input, option) =>
                                option.props.children.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                            {shopListInArray.map((shop) => {
                                return <Option value={shop.id} key={shop.id}>
                                    <Link to={`${match.url}/${shop.id}`}>
                                        <div style={{ width: "100%", color: "#808080" }}>{shop.name}</div>
                                    </Link>
                                </Option>
                            })}
                        </Select>
                        {requestQuantity > 0 ?
                            <div style={{ width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}><Spin size="large" /></div> :
                            <div>
                                <Route
                                    path={match.url}
                                    exact
                                    render={props => <Empty description="请选择门店" />} />
                                <Route
                                    path={`${match.url}/:shopId`}
                                    exact
                                    render={props =>
                                        <ShopInfo {...props} byClerks={byClerks} shopInfo={shopInfo} />} />
                                <Route
                                    path={`${match.url}/:shopId/:clerkId`}
                                    render={(props) => (<div>clerk</div>)} />
                            </div>
                        }
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