import React from "react";
import {
    Descriptions,
    Tooltip,
    Empty,
    Select,
    Spin,
    Button,
    Input,
    Row,
    Col,
    Tag,
    Icon,
    Modal
} from "antd";
import { Link, Prompt } from "react-router-dom";
import { TweenOneGroup } from 'rc-tween-one';
import PictureCard from "../../../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as appActions, getError, getRequestQuantity, getModalRequestQuantity } from "../../../../../redux/modules/app";
import { actions as shopActions, getShop, getShopList, getBoxes, getDisplay } from "../../../../../redux/modules/shop";
import { actions as clerkActions, getByClerks, getClerks } from "../../../../../redux/modules/clerk";
import {
    actions as uiActions,
    getShopId_shopManagement,
    getAddButtonVisible_shopManagement,
    getAlterInfoState,
    getModalVisible,
    getClientHeight,
    getClientWidth
} from "../../../../../redux/modules/ui";
import AddClerkModal from "../AddClerkModal";
import BoxCard from "../BoxCard";

const { Option } = Select;

class ShopView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shopInfo: { ...this.props.shop.shopInfo },
            selectClerks: [],
            selectManagers: [],
        }
    }
    onChange = (value) => {
        this.props.fetchShopInfo(value);
        this.props.selectShop_shopManagement(value);
    }
    showClerkInfo = () => {
        this.props.setAddButtonInvisible();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.shop.shopInfo !== state.shopInfo && !props.alterInfo) {
            return {
                shopInfo: { ...props.shop.shopInfo }
            };
        } else {
            return null;
        }
    }

    startAlterInfo = () => {
        this.props.startAlterInfo();
    }

    completeAlter = () => {
        const newShopInfo = this.state;
        console.log(newShopInfo);
        this.setState({ shopInfo: this.props.shop.shopInfo, selectClerks: new Array(), selectManagers: new Array() });
        this.props.alterShopInfo(newShopInfo)
            .then((data) => {
                this.props.callMessage("success", "修改信息成功！");
            })
            .catch((err) => {
                this.props.callMessage("error", err);
            });
    }

    handleCancelAlter = () => {
        const { shopInfo } = this.props.shop;
        this.setState({ shopInfo });
        this.props.finishAlterInfo();
    }

    componentDidMount() {
        if (this.props.shop.shopList.length == 0) {
            this.props.fetchShopList();
        }
    }


    componentWillUnmount() {
        this.props.finishAlterInfo();
        // this.props.selectShop_shopManagement("请选择门店");
    }

    handleChange = (e) => {
        const name = e.target.name;
        const { shopInfo } = this.state;
        const newShopInfo = { ...shopInfo, [name]: e.target.value };
        this.setState({
            shopInfo: newShopInfo
        })
    }

    handleRemoveClerk = (clerkId) => {
        const { shopInfo, selectClerks, selectManagers } = this.state;
        const newClerks = shopInfo.clerks.filter((item) => item !== clerkId);
        const newSelectClerks = selectClerks.filter((item) => item !== clerkId);
        const newSelectManagers = selectManagers.filter((item) => item !== clerkId);
        const newShopInfo = { ...shopInfo, clerks: newClerks };
        this.setState({ shopInfo: newShopInfo, selectClerks: newSelectClerks, selectManagers: newSelectManagers });
        // this.props.removeShopClerk(clerkId);
    }

    handleAddClerk = (clerks) => {
        this.props.addShopClerk(clerks);
    }


    deleteBoxInfo = (shopId, boxId) => {
        this.props.deleteBoxInfo(shopId, boxId);
    }

    handleDisplayChange = (fileList) => {
        let display = [];
        for (var key in fileList) {
            display.push(fileList[key].uid);
        }
        const { shopInfo } = this.state;
        const newShopInfo = { ...shopInfo, display };
        this.setState({ shopInfo: newShopInfo });
        // this.props.setDisplay(display);
    };

    showModal = () => {
        this.props.openModal();
        this.props.startModalRequest();
        this.props.fetchAllClerks();
    };

    fetchAllClerks = () => {
        this.props.fetchAllClerks();
    }

    handleModalOk = () => {
        // this.props.addShopClerk(clerks);
        const { shopInfo, selectClerks, selectManagers } = this.state;
        const { clerks } = shopInfo;
        const newClerks = [...clerks, ...selectClerks, ...selectManagers];
        const newShopInfo = { ...shopInfo, clerks: newClerks };
        this.setState({ shopInfo: newShopInfo, selectClerks, selectManagers });
        this.props.closeModal();
    }

    handleModalCancel = () => {
        this.setState({ selectClerks: new Array(), selectManagers: new Array() });
        this.props.closeModal();
    }

    //新增服务员处理器
    handleClerksChange = (value) => {
        this.setState({ selectClerks: value });
    }

    //新增店长处理器
    handleManagersChange = (value) => {
        this.setState({ selectManagers: value });
    }

    forDisplay = () => {
        const { shopInfo } = this.props.shop;
        if (shopInfo === null) {
            return {
                fileListInProps: new Array(),
                fileListInState: new Array()
            };
        }
        const { byDisplay } = this.props;
        const fileListInProps = shopInfo.display.map((displayId) => byDisplay[displayId]);
        const shopInfoInState = this.state.shopInfo;
        const fileListInState = shopInfoInState.display.map((displayId) => byDisplay[displayId]);
        return {
            fileListInProps,
            fileListInState
        };
    }

    render() {
        const { shopList, shopInfo } = this.props.shop;
        const { byClerks, match, shopId, byShopList, modalRequestQuantity, clerks,
            requestQuantity, byBoxes, alterInfo, modalVisible, shop } = this.props;
        const { fileListInProps, fileListInState } = this.forDisplay();
        return (
            <div>
                <div>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        defaultValue={!shopId || shopId === "请选择门店" ? "请选择门店" : shopId}
                        onChange={this.onChange}
                        filterOption={(input, option) =>
                            option.props.children.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                        {shop.shopList.map((shopId) => {
                            return <Option value={byShopList[shopId].id} key={byShopList[shopId].id}>{byShopList[shopId].name}</Option>
                        })}
                    </Select>
                    {shopId === "" || shopId === "请选择门店" ? null : <Button onClick={this.startAlterInfo} style={{ marginBottom: "20px", float: "right" }}>修改门店信息</Button>}
                </div>
                {requestQuantity > 0 ?
                    <div style={{ width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}><Spin size="large" /></div> :
                    <div style={{ margin: "20px 0" }}>
                        {shopId === "" || shopId === "请选择门店" ? <Empty description="请选择门店" /> :
                            shopInfo ?
                                <Descriptions bordered column={2}>
                                    <Descriptions.Item label="门店名称">
                                        {alterInfo ?
                                            <Input value={this.state.shopInfo.name} allowClear name="name" onChange={this.handleChange} />
                                            : shopInfo.name}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="地址">
                                        {alterInfo ?
                                            <Input value={this.state.shopInfo.address} allowClear name="address" onChange={this.handleChange} />
                                            : shopInfo.address}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="介绍" span={2}>
                                        {alterInfo ?
                                            <Input.TextArea rows={3} value={this.state.shopInfo.description} allowClear name="description" onChange={this.handleChange} />
                                            : shopInfo.description}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="营业时间">
                                        {alterInfo ?
                                            <Input value={this.state.shopInfo.businessHours} allowClear name="businessHours" onChange={this.handleChange} />
                                            : shopInfo.businessHours}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="联系方式">
                                        {alterInfo ?
                                            <Input value={this.state.shopInfo.contact} allowClear name="contact" onChange={this.handleChange} />
                                            : shopInfo.contact}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="职员" span={2} >
                                        {alterInfo ?
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
                                                    {this.state.shopInfo.clerks.map((id) => (
                                                        <span key={id} style={{ display: 'inline-block' }}>
                                                            <Tag
                                                                closable
                                                                style={{ margin: "10px" }}
                                                                onClose={e => {
                                                                    e.preventDefault();
                                                                    this.handleRemoveClerk(id);
                                                                }}
                                                            >
                                                                {byClerks[id].position == null ?
                                                                    (this.state.selectClerks.indexOf(id) !== -1 ?
                                                                        byClerks[id].name + " · " + "服务员" :
                                                                        byClerks[id].name + " · " + "店长")
                                                                    : (byClerks[id].name + " · " + byClerks[id].position)
                                                                }
                                                            </Tag>
                                                        </span>))
                                                    }
                                                </TweenOneGroup>
                                                {alterInfo && <Tag onClick={this.showModal} style={{ background: '#fff', borderStyle: 'dashed', margin: "10px" }}>
                                                    <Icon type="plus" /> 添加职员
                                                </Tag>}
                                            </div>
                                            : shopInfo.clerks.length != 0 && byClerks != null ? shopInfo.clerks.map((id) => (
                                                <Tooltip key={id} title={"点击查看员工详情"} placement="topLeft">
                                                    <Link to={`${match.url}/clerkDetail/${shopId}/${id}`}>
                                                        <Tag onClick={this.showClerkInfo} style={{ margin: "10px" }}>
                                                            {byClerks[id].name} · {byClerks[id].position}
                                                        </Tag></Link>
                                                </Tooltip>
                                            )) : <Empty />}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="门店展示图片" span={2}>
                                        {alterInfo ?
                                            <PictureCard
                                                fileList={fileListInState}
                                                alterInfo={alterInfo}
                                                p="state"
                                                onChange={this.handleDisplayChange} />
                                            : shopInfo.display === null || shopInfo.display.length === 0 ?
                                                <Empty />
                                                : <PictureCard
                                                    fileList={fileListInProps}
                                                    p="props"
                                                    alterInfo={alterInfo}
                                                    onChange={this.handleDisplayChange} />
                                        }
                                    </Descriptions.Item>
                                    <Descriptions.Item label="包厢" span={2}>
                                        <div>
                                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <Link to={{
                                                    pathname: `${match.url}/addBox/${shopId}`,
                                                    state: { from: this.props.location }
                                                }}>
                                                    <Button type="primary">新增包厢</Button>
                                                </Link>
                                            </div>
                                            {shopInfo.boxes.length > 0 ?
                                                shopInfo.boxes.map((boxId) => (
                                                    <BoxCard
                                                        key={boxId}
                                                        match={match}
                                                        shopId={shopId}
                                                        deleteBoxInfo={this.deleteBoxInfo}
                                                        boxInfo={byBoxes[boxId]}
                                                        alterInfo={alterInfo} />))

                                                : <Empty />
                                            }
                                        </div>
                                    </Descriptions.Item>
                                </Descriptions>
                                : <Empty />
                        }
                        {alterInfo ?
                            <Row style={{ margin: "20px 0" }}>
                                <Col span={12} offset={4}>
                                    <Button type="primary" block onClick={this.completeAlter} loading={modalRequestQuantity > 0} >{modalRequestQuantity > 0 ? "" : "确认修改"}</Button>
                                </Col>
                                <Col span={4} push={4}>
                                    <Button block onClick={this.handleCancelAlter}>取消修改</Button>
                                </Col>
                            </Row>
                            : null}
                    </div>
                }
                <AddClerkModal
                    visible={modalVisible}
                    requestQuantity={modalRequestQuantity}
                    clerks={clerks}
                    selectClerks={this.state.selectClerks}
                    selectManagers={this.state.selectManagers}
                    handleClerksChange={this.handleClerksChange}
                    handleManagersChange={this.handleManagersChange}
                    byClerks={byClerks}
                    handleOk={this.handleModalOk}
                    handleCancel={this.handleModalCancel}
                />
                <Prompt message="当前页面正在输入中，离开此页面您输入的数据不会被保存，是否离开?" when={alterInfo} />
            </div>
        );
    }

}
const mapStateToProps = (state, props) => {
    return {
        shop: getShop(state),
        clerks: getClerks(state),
        byClerks: getByClerks(state),
        requestQuantity: getRequestQuantity(state),
        error: getError(state),
        shopId: getShopId_shopManagement(state),
        addButtonVisible: getAddButtonVisible_shopManagement(state),
        byBoxes: getBoxes(state),
        alterInfo: getAlterInfoState(state),
        byDisplay: getDisplay(state),
        modalVisible: getModalVisible(state),
        modalRequestQuantity: getModalRequestQuantity(state),
        clientWidth: getClientWidth(state),
        clientHeight: getClientHeight(state),
        byShopList: getShopList(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(shopActions, dispatch),
        ...bindActionCreators(uiActions, dispatch),
        ...bindActionCreators(clerkActions, dispatch),
        ...bindActionCreators(appActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopView);