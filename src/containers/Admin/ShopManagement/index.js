import React from "react";
import PageHeader from "../../../components/AdminPageHeader";
import { Select, Empty } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getShop, getShopList } from "../../../redux/modules/shop";

const { Option } = Select;

class ShopManagement extends React.Component {
    onChange = (value) => {
        console.log(`selected ${value}`);
    }

    onBlur = () => {
        console.log('blur');
    }

    onFocus = () => {
        console.log('focus');
    }

    onSearch = (val) => {
        console.log('search:', val);
    }

    componentDidMount() {
        this.props.fetchShopList();
    }
    render() {
        const { shopList, shopInfo } = this.props.shop;
        const {shopListInArray}=this.props;
        return (
            <PageHeader
                title="门店管理">
                <div>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="请选择门店"
                        optionFilterProp="children"
                        onChange={this.onChange}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        onSearch={this.onSearch}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {shopListInArray.map((shop) => {
                            return <Option value={shop.id} key={shop.id}>{shop.name}</Option>
                        })}
                    </Select>
                    <Empty />
                </div>
            </PageHeader>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        shop: getShop(state),
        shopListInArray: getShopList(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(shopActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopManagement);