import React from "react";
import { Tag, Icon, Modal } from "antd";
import { TweenOneGroup } from 'rc-tween-one';
import { actions as shopActions } from "../../../../../../../redux//modules/shop";
import { actions as clerkActions, getClerks, getByClerks } from "../../../../../../../redux//modules/clerk";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { requestType } from "../../../../../../../utils/common";
import CheckableTag from "../../../../../../../components/CheckableTag";

/**
 * 门店职员修改面板组件
 */
class ShopClerkInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            addNewClerk: new Array(),
        }
    }

    triggerChange = changedValue => {
        const { onChange, value } = this.props;
        if (onChange) {
            onChange(changedValue);
        }
    };

    removeShopClerk = (uid) => {
        const { value } = this.props;
        const updateShopClerks = value.filter(item => item != uid);
        this.triggerChange(updateShopClerks);
    }

    showOtherClerks = () => {
        this.props.fetchAllClerks(requestType.updateRequest)
            .then(() => {
                this.setState({ visible: true });
            });
    }

    handleClickOtherClerk = (uid) => {
        const { addNewClerk } = this.state;
        if (addNewClerk.indexOf(uid) == -1) {
            this.setState({ addNewClerk: addNewClerk.concat([uid]) });
        } else {
            this.setState({ addNewClerk: addNewClerk.filter(item => item != uid) });
        }
    }

    handleAddClerkOk = () => {
        const { addNewClerk } = this.state;
        const { value } = this.props;
        const updateShopClerks = value.concat(addNewClerk);
        this.triggerChange(updateShopClerks);
        this.setState({ addNewClerk: new Array(),visible:false });
    }

    render() {
        const { value, byClerks, clerks } = this.props;
        const { visible } = this.state;
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
                                color="purple"
                                style={{ margin: "10px" }}
                                onClose={e => {
                                    e.preventDefault();
                                    this.removeShopClerk(uid);
                                }}
                            >
                                {byClerks[uid].name} · {byClerks[uid].position==null||byClerks[uid].position==undefined?"暂未分配职务":byClerks[uid].position.name}
                            </Tag>
                        </span>))
                    }
                </TweenOneGroup>
                <Tag onClick={this.showOtherClerks}
                    style={{ background: '#fff', borderStyle: 'dashed', margin: "10px" }}>
                    <Icon type="plus" /> 添加职员
                </Tag>
                <Modal
                    title="添加职员"
                    visible={visible}
                    onOk={this.handleAddClerkOk}
                    onCancel={() => this.setState({ visible: false, addNewClerk: new Array() })}
                >
                    {clerks.map(uid => {
                        if (value.indexOf(uid) == -1) {
                            return <CheckableTag key={uid} onClick={() => this.handleClickOtherClerk(uid)}>{byClerks[uid].name}</CheckableTag>
                        }
                    })}
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        clerks: getClerks(state),
        byClerks: getByClerks(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(shopActions, dispatch),
        ...bindActionCreators(clerkActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopClerkInput);;