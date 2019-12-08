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
import { Link } from "react-router-dom";
import { TweenOneGroup } from 'rc-tween-one';
import PictureCard from "../../../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as appActions, getError, getRequestQuantity, getModalRequestQuantity } from "../../../../../redux/modules/app";
import { actions as shopActions, getShop, getShopList, getBoxesInArray, getDisplay } from "../../../../../redux/modules/shop";
import { actions as clerkActions, getPlainClerks, getClerks } from "../../../../../redux/modules/clerk";
import {
    actions as uiActions,
    getShopId_shopManagement,
    getAddButtonVisible_shopManagement,
    getAlterInfoState,
    getModalVisible
} from "../../../../../redux/modules/ui";
import AddClerkModal from "./components/AddClerkModal";

const { Option } = Select;

class ShopView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shopInfo: { ...this.props.shop.shopInfo },
            modalVisible: false,
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
        this.props.finishAlterInfo();
    }

    componentDidMount() {
        this.props.fetchShopList();
    }


    componentWillUnmount() {
        this.props.finishAlterInfo();
        this.props.selectShop_shopManagement("请选择门店");
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
        const { shopInfo,selectClerks,selectManagers } = this.state;
        const newClerks = shopInfo.clerks.filter((item) => item != clerkId);
        const newSelectClerks=selectClerks.filter((item) => item != clerkId);
        const newSelectManagers=selectManagers.filter((item) => item != clerkId);
        const newShopInfo = { ...shopInfo, clerks: newClerks };
        console.log(newShopInfo)
        this.setState({ shopInfo: newShopInfo,selectClerks:newSelectClerks,selectManagers:newSelectManagers });
        // this.props.removeShopClerk(clerkId);
    }

    handleAddClerk = (clerks) => {
        this.props.addShopClerk(clerks);
    }

    forDisplay = (displayId) => {
        const { byDisplay } = this.props;
        return byDisplay[displayId];
    }


    handleDisplayChange = (fileList) => {
        console.log(fileList)
        let display = [];
        for (var key in fileList) {
            display.push(fileList[key].uid);
        }
        this.props.setDisplay(display);
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
        const { shopInfo,selectClerks, selectManagers } = this.state;
        const { clerks } = shopInfo;
        const newClerks = [...clerks, ...selectClerks, ...selectManagers];
        const newShopInfo = { ...shopInfo, clerks: newClerks };
        this.setState({ shopInfo: newShopInfo, selectClerks, selectManagers });
        this.props.closeModal();
    }

    handleModalCancel = () => {
        this.setState({ selectClerks: new Array(),selectManagers:new Array() });
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


    render() {
        const { shopList, shopInfo } = this.props.shop;
        const { byClerks, match, shopId, shopListInArray, modalRequestQuantity, clerks,
            requestQuantity, boxesInArray, alterInfo, modalVisible } = this.props;
        const fileList = shopInfo == null ? [] : shopInfo.display.map(this.forDisplay);
        return (
            <div>
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
                            return <Option value={shop.id} key={shop.id}>{shop.name}</Option>
                        })}
                    </Select>
                    {shopId == "" || shopId == "请选择门店" ? null : <Button onClick={this.startAlterInfo} style={{ marginBottom: "20px", float: "right" }}>修改门店信息</Button>}
                </div>
                {requestQuantity > 0 ?
                    <div style={{ width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}><Spin size="large" /></div> :
                    <div style={{ margin: "20px 0" }}>
                        {shopId == "" || shopId == "请选择门店" ? <Empty description="请选择门店" /> :
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
                                            <Input.TextArea rows={3} value={this.state.shopInfo.introduction} allowClear name="introduction" onChange={this.handleChange} />
                                            : shopInfo.introduction}
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
                                                                    (this.state.selectClerks.indexOf(id) != -1 ?
                                                                    byClerks[id].name + " · " +"服务员" :
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
                                                    <Link to={`${match.url}/${shopId}/${id}`}>
                                                        <Tag onClick={this.showClerkInfo} style={{ margin: "10px" }}>
                                                            {byClerks[id].name} · {byClerks[id].position}
                                                        </Tag></Link>
                                                </Tooltip>
                                            )) : <Empty />}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="门店展示图片" span={2}>
                                        {shopInfo.display == null || shopInfo.display.length == 0 ? alterInfo ?
                                            <PictureCard
                                                fileList={fileList}
                                                alterInfo={alterInfo}
                                                onChange={this.handleDisplayChange} />
                                            : <Empty />
                                            : <PictureCard
                                                fileList={fileList}
                                                alterInfo={alterInfo}
                                                onChange={this.handleDisplayChange} />
                                        }
                                    </Descriptions.Item>
                                    <Descriptions.Item label="包厢" span={2}>{boxesInArray.length != 0 ? "asdf" :
                                        <Empty />}</Descriptions.Item>
                                </Descriptions>
                                : <Empty />
                        }
                        {alterInfo ?
                            <Row style={{ margin: "20px 0" }}>
                                <Col span={12} offset={6}>
                                    <Button type="primary" block onClick={this.completeAlter} loading={requestQuantity > 0} >{requestQuantity > 0 ? "" : "确认修改"}</Button>
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
            </div>
        );
    }

}
const mapStateToProps = (state, props) => {
    return {
        shop: getShop(state),
        shopListInArray: getShopList(state),
        clerks: getClerks(state),
        byClerks: getPlainClerks(state),
        requestQuantity: getRequestQuantity(state),
        error: getError(state),
        shopId: getShopId_shopManagement(state),
        addButtonVisible: getAddButtonVisible_shopManagement(state),
        boxesInArray: getBoxesInArray(state),
        alterInfo: getAlterInfoState(state),
        byDisplay: getDisplay(state),
        modalVisible: getModalVisible(state),
        modalRequestQuantity: getModalRequestQuantity(state),
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