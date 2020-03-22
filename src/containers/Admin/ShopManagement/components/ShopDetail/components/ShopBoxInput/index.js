import React from "react";
import { Tag, Icon } from "antd";
import { TweenOneGroup } from 'rc-tween-one';
import { actions as shopActions, getByShopBoxes } from "../../../../../../../redux//modules/shop";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { map } from "../../../../../../../router";

/**
 * 门店包厢修改面板组件
 */
class ShopBoxInput extends React.Component {

    triggerChange = changedValue => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(changedValue);
        }
    };

    removeShopBox = (uid) => {
        const { value } = this.props;
        const updateShopBox = value.filter(item => item != uid);
        this.triggerChange(updateShopBox);
    }
    render() {
        const { value, byShopBoxes } = this.props;
        return (
            <div>
                <TweenOneGroup
                    enter={{
                        scale: 0.8,
                        opacity: 0,
                        type: 'from',
                        duration: 100,
                        onComplete: e => {
                            e.target.style = '';
                        },
                    }}
                    leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                    appear={false}
                >
                    {value.map((uid) => (
                        <span key={uid} style={{ display: 'inline-block' }}>
                            <Tag
                                closable
                                color="volcano"
                                style={{ margin: "10px" }}
                                onClose={e => {
                                    e.preventDefault();
                                    this.removeShopBox(uid);
                                }}
                            >
                                {byShopBoxes[uid].name}
                            </Tag>
                        </span>))
                    }
                </TweenOneGroup>
                <Link to={`${map.admin.AdminHome()}/shop_management/add_shop_box`}>
                    <Tag
                        style={{ background: '#fff', borderStyle: 'dashed', margin: "10px" }}>
                        <Icon type="plus" /> 添加门店
                </Tag>
                </Link>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        byShopBoxes: getByShopBoxes(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(shopActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopBoxInput);;