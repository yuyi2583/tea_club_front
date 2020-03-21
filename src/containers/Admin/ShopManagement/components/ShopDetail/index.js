import React from "react";
import {
    Descriptions, Tooltip, Empty, Select, Spin, Button,
    Input, Row, Col, Tag, Icon, Typography, Form, Skeleton, Modal
} from "antd";
import { Link, Prompt, Redirect } from "react-router-dom";
import { TweenOneGroup } from 'rc-tween-one';
import PictureCard from "../../../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
    actions as appActions, getError,
    // getRetrieveRequestQuantity, getModalRequestQuantity 
} from "../../../../../redux/modules/app";
import { actions as shopActions, getShops, getByShops, getByOpenHours, getByPhotos, getShopBoxes, getByShopBoxes } from "../../../../../redux/modules/shop";
import { actions as clerkActions, getByClerks, getClerks } from "../../../../../redux/modules/clerk";
import AddClerkModal from "../AddClerkModal";
// import ShopBoxCard from "../ShopBoxCard";
import { convertToDay } from "../../../../../utils/commonUtils";
import AlterOpenHourModal from "../AlterOpenHourModal";
import { map } from "../../../../../router";
import "./style.css";
import DynamicFieldSet from "../../../../../components/DynamicFieldSet";
import ShopOpenHour from "../../../../../components/ShopOpenHour";
import ShopClerkInput from "./components/ShopClerkInput";

const { Option } = Select;
const { Text } = Typography;
const { confirm } = Modal;

class ShopDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: new Array(),
        }
    }
    onChange = (value) => {
        console.log("on change", value);
        this.props.fetchShopInfo(value);
        this.props.selectShop_shopManagement(value);
    }
    showClerkInfo = () => {
        this.props.setAddButtonInvisible();
    }


    completeAlter = () => {
        const newShopInfo = this.state;
        const { shopInfo } = newShopInfo;
        console.log(newShopInfo);
        let flag = true;
        for (var key in shopInfo) {
            if (shopInfo[key] == null || shopInfo[key] === "") {
                this.props.callMessage("error", "输入框不能为空");
                flag = false;
                return;
            }
        }
        // if(!flag){
        //     return;
        // }
        this.setState({ shopInfo: this.props.shop.shopInfo, selectClerks: new Array(), selectManagers: new Array(), byOpenHours: this.props.byOpenHours });
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



    showModal = () => {
        this.props.openModal();
        this.props.startModalRequest();
        this.props.fetchAllClerks();
    };

    fetchAllClerks = () => {
        this.props.fetchAllClerks();
    }

    handleModalOk = (type = 0) => {
        // this.props.addShopClerk(clerks);
        if (type === 0) {
            const { shopInfo, selectClerks, selectManagers } = this.state;
            const { clerks } = shopInfo;
            const newClerks = [...clerks, ...selectClerks, ...selectManagers];
            const newShopInfo = { ...shopInfo, clerks: newClerks };
            this.setState({ shopInfo: newShopInfo, selectClerks, selectManagers });
            this.props.closeModal();
        } else if (type === 1) {
            const { byOpenHours } = this.state;
            const { openHours } = this.state.shopInfo;
            let breakFlag = true;
            openHours.forEach((item) => {
                let startStatus = "success";
                let endStatus = "success";
                let repeatStatus = "success";
                if (byOpenHours[item].startTime == null || byOpenHours[item].startTime === "") {
                    startStatus = "error";
                    breakFlag = false;
                } else {
                    startStatus = "success";
                }
                if (byOpenHours[item].endTime == null || byOpenHours[item].endTime === "") {
                    endStatus = "error";
                    breakFlag = false;
                } else {
                    endStatus = "success";
                }
                if (byOpenHours[item].repeat.length === 0) {
                    repeatStatus = "error";
                    breakFlag = false;
                } else {
                    repeatStatus = "success";
                }
                let byOpenHoursItem = {
                    ...byOpenHours[item],
                    repeatStatus: repeatStatus,
                    startStatus: startStatus,
                    endStatus: endStatus
                };
                this.setState({ byOpenHours: { ...byOpenHours, [item]: byOpenHoursItem } });
            })
            if (!breakFlag) {
                return;
            }
            this.setState({ alterOpenHour: false });
        }

    }

    handleModalCancel = (type = 0) => {
        if (type === 0) {
            this.setState({ selectClerks: new Array(), selectManagers: new Array() });
            this.props.closeModal();
        } else if (type === 1) {
            this.setState({ alterOpenHour: false });
        }
    }

    alterOpenHour = () => {
        this.setState({ alterOpenHour: true });
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

    getOpenHours = () => {
        const { byOpenHours } = this.props;
        const { openHours } = this.props.shop.shopInfo;
        let openHoursChildrenInProps = openHours.map((item) => {
            const day = convertToDay(byOpenHours[item].repeat);
            // const dayChildren=day.map((item)=>)
            return (
                <div key={item} style={{ margin: "5px" }}>
                    <Text>
                        {byOpenHours[item].startTime}~{byOpenHours[item].endTime}&nbsp;&nbsp;{day}
                    </Text>
                </div>
            )
        });
        let openHoursChildrenInState = null;
        if (this.state.byOpenHours) {
            const byOpenHours1 = this.state.byOpenHours;
            const openHours1 = this.state.shopInfo.openHours;
            openHoursChildrenInState = openHours1.map((item) => {
                const day1 = convertToDay(byOpenHours1[item].repeat);
                // const dayChildren=day.map((item)=>)
                return (
                    <div key={item} style={{ margin: "5px" }}>
                        <Text>
                            {byOpenHours1[item].startTime}~{byOpenHours1[item].endTime}&nbsp;&nbsp;{day1}
                        </Text>
                    </div>
                )
            });
        }
        return {
            openHoursChildrenInProps,
            openHoursChildrenInState
        };
    }

    handleStartTimePickerChange = (time, timeString, index) => {
        const newOpenHour = { ...this.state.byOpenHours[index], startTime: timeString };
        this.setState({ byOpenHours: { ...this.state.byOpenHours, [index]: newOpenHour } });
    }

    handleEndTimePickerChange = (time, timeString, index) => {
        const newOpenHour = { ...this.state.byOpenHours[index], endTime: timeString };
        this.setState({ byOpenHours: { ...this.state.byOpenHours, [index]: newOpenHour } });
    }

    handleRepeatChange = (value, index) => {
        const newOpenHour = { ...this.state.byOpenHours[index], repeat: value };
        this.setState({ byOpenHours: { ...this.state.byOpenHours, [index]: newOpenHour } });
    }

    handleAddOpenHour = () => {
        let openHours = new Array();
        this.state.shopInfo.openHours.forEach((item) => {
            openHours.push(item);
        })
        openHours.push(openHours[openHours.length - 1] + 1);
        const byOpenHours = { ...this.state.byOpenHours, [openHours[openHours.length - 1]]: { endTime: null, startTime: null, repeat: new Array(), endStatus: "success", startStatus: "success", repeatStatus: "success" } };
        const shopInfo = { ...this.state.shopInfo, openHours };
        this.setState({ shopInfo, byOpenHours })
    }

    handleRemoveOpenHour = (index) => {
        const openHours = this.state.shopInfo.openHours.filter((item) => item !== index);
        const shopInfo = { ...this.state.shopInfo, openHours };
        this.setState({ shopInfo });
    }
    //////////////////////////////////////////////////////////////////////above discard
    componentDidMount() {
        const { shopId } = this.props.match.params;
        this.props.fetchShop(shopId);
    }

    getOpenHoursDisplay = () => {
        const { shopId } = this.props.match.params;
        const { byShops, byOpenHours } = this.props;
        let openHoursDisplay = byShops[shopId].openHours != null ? byShops[shopId].openHours.map(uid =>
            <div key={uid}>
                {byOpenHours[uid].startTime}~{byOpenHours[uid].endTime}&nbsp;&nbsp;
                {byOpenHours[uid].date != undefined ?
                    convertToDay(byOpenHours[uid].date)
                    : null}
            </div>
        ) : null;
        return openHoursDisplay
    }

    getClerksDisplay = () => {
        const { shopId } = this.props.match.params;
        const { byClerks, byShops } = this.props;
        let clerksDisplay = byShops[shopId].clerks != null ? byShops[shopId].clerks.map((uid) => (
            <Tooltip key={uid} title={"点击查看员工详情"} placement="topLeft">
                <Link to={`${map.admin.AdminHome()}/clerk_management/clerks/${uid}`}>
                    <Tag color="purple" onClick={this.showClerkInfo} style={{ margin: "10px" }}>
                        {byClerks[uid].name} · {byClerks[uid].position==null||byClerks[uid].position==undefined?"暂未分配职务":byClerks[uid].position.name}
                    </Tag></Link>
            </Tooltip>
        )) : <Empty />;
        return clerksDisplay;
    }

    getPhotosDisplay = () => {
        const { shopId } = this.props.match.params;
        const { byPhotos, byShops } = this.props;
        let photoDisplay = byShops[shopId].photos != null && byShops[shopId].photos.length > 0 ? byShops[shopId].photos.map((uid) => ({
            uid,
            name: 'image.png',
            status: 'done',
            type: "image/jpeg",
            // url:byPhotos[uid].photo
            thumbUrl: `data:image/png;base64,${byPhotos[uid].photo}`,
        })) : new Array();
        return photoDisplay;
    }

    getShopBoxesDisplay = () => {
        const { shopId } = this.props.match.params;
        const { byShopBoxes, byShops, alterInfo } = this.props;
        let shopBoxesDisplay = <Empty />;
        try {
            shopBoxesDisplay = byShops[shopId].shopBoxes.map((uid) =>
                <Tooltip key={uid} title={"点击查看包厢详情"} placement="topLeft">
                    <Link to={`${map.admin.AdminHome()}/shop_management/shop_boxes/shop_box/${uid}`}>
                        <Tag color="volcano" style={{ margin: "10px" }}>
                            {byShopBoxes[uid].name}
                        </Tag>
                    </Link>
                </Tooltip>
            )
        } catch{
            shopBoxesDisplay = <Empty />
        }
        return shopBoxesDisplay;
    }

    handleDisplayChange = (type, data) => {
        const { fileList } = this.state;
        switch (type) {
            case "done":
                console.log("add shop photo", data);
                if (fileList.indexOf(data.uid) == -1) {
                    this.setState({ fileList: fileList.concat([data.uid]) });
                }
                break;
            case "removed":
                console.log("remove shop photo", data);
                let newFileList = fileList.filter(uid => uid != data.uid);
                this.setState({ fileList: newFileList });
                break;
        }

    }

    handleSubmit = e => {
        e.preventDefault();
        // const { fileList } = this.state;
        // const { shopBoxId } = this.props.match.params;
        // const { byShopBoxes } = this.props;
        // const thiz = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                confirm({
                    title: '确认修改?',
                    content: '输入数据是否无误，确认修改该产品信息',
                    onCancel() {
                    },
                    onOk() {
                        console.log(values);

                        // const shop = { uid: values.shopId };
                        // const price = { ingot: values.ingot, credit: values.credit, uid: byShopBoxes[shopBoxId].price.uid };
                        // const shopBox = { ...values, price, photos: fileList, uid: shopBoxId, shop };
                        // console.log("new shop box", shopBox);
                        // thiz.props.updateShopBox(shopBox).then(() => {
                        //     thiz.props.callMessage("success", "更新包厢成功！");
                        //     thiz.props.finishAlterInfo();
                        // }).catch((err) => {
                        //     thiz.props.callMessage("error", "更新包厢失败!" + err);
                        // });
                    },
                });

            }
        });
    };

    render() {
        const { from } = this.props.location.state || { from: { pathname: map.admin.AdminHome() } };
        if (this.props.connectError) {
            return <Redirect to={{
                pathname: map.error(),
                state: { from }
            }} />
        }
        const { shopId } = this.props.match.params;
        // const { shopList, shopInfo } = this.props.shop;
        // const { byClerks, match, byShopList, modalRequestQuantity, clerks,
        //     retrieveRequestQuantity, byBoxes, alterInfo, modalVisible, shop, shops, byShops } = this.props;
        const { retrieveRequestQuantity, alterInfo, byShops, updateRequestQuantity, byOpenHours, byClerks } = this.props;
        // const { fileListInProps, fileListInState } = this.forDisplay();
        const { getFieldDecorator } = this.props.form;
        const isDataNull = byShops[shopId] == undefined || byShops[shopId] == null;
        const openHoursDisplay = this.getOpenHoursDisplay();
        const clerksDisplay = this.getClerksDisplay();
        const photoDisplay = this.getPhotosDisplay();
        const shopBoxesDisplay = this.getShopBoxesDisplay();
        // const { openHoursChildrenInProps, openHoursChildrenInState } = this.props.shop.shopInfo != null && this.getOpenHours();
        return (
            <Spin spinning={updateRequestQuantity > 0}>
                {retrieveRequestQuantity > 0 ?
                    <Skeleton active />
                    :
                    <Form onSubmit={this.handleSubmit}>
                        <Descriptions bordered column={2} style={{ marginBottom: "20px" }}>
                            <Descriptions.Item label="门店名称">
                                {alterInfo ?
                                    <Form.Item>
                                        {getFieldDecorator('name', {
                                            rules: [{ required: true, message: '请输入门店名称!' }],
                                            initialValue: byShops[shopId].name
                                        })(<Input allowClear name="name" placeholder="请输入门店名称" />)}
                                    </Form.Item>
                                    : isDataNull ? null
                                        : byShops[shopId].name}
                            </Descriptions.Item>
                            <Descriptions.Item label="联系方式">
                                {alterInfo ?
                                    <Form.Item>
                                        {getFieldDecorator('contact', {
                                            rules: [{ required: true, message: '请输入门店联系方式!' }],
                                            initialValue: byShops[shopId].contact
                                        })(<Input allowClear name="contact" placeholder="请输入门店联系方式" />)}
                                    </Form.Item>
                                    : byShops[shopId].contact}
                            </Descriptions.Item>
                            <Descriptions.Item label="地址" span={2}>
                                {alterInfo ?
                                    <Form.Item>
                                        {getFieldDecorator('address', {
                                            rules: [{ required: true, message: '请输入门店地址!' }],
                                            initialValue: byShops[shopId].address
                                        })(<Input allowClear name="address" placeholder="请输入门店地址" />)}
                                    </Form.Item>
                                    : isDataNull ? null
                                        : byShops[shopId].address}
                            </Descriptions.Item>
                            <Descriptions.Item label="介绍" span={2}>
                                {alterInfo ?
                                    <Form.Item>
                                        {getFieldDecorator('description', {
                                            rules: [{ required: true, message: '请输入门店描述!' }],
                                            initialValue: byShops[shopId].description
                                        })(<Input.TextArea rows={3} allowClear name="description" placeholder="请输入门店描述" />)}
                                    </Form.Item>
                                    : isDataNull ? null
                                        : byShops[shopId].description}
                            </Descriptions.Item>
                            <Descriptions.Item label="营业时间" span={2}>
                                {alterInfo ?
                                    < DynamicFieldSet
                                        form={this.props.form}
                                        content={"添加营业时间"}
                                        template={
                                            <ShopOpenHour form={this.props.form} />
                                        }
                                    >
                                        {
                                            byShops[shopId].openHours.map(uid =>
                                                <ShopOpenHour
                                                    key={uid}
                                                    form={this.props.form}
                                                    openHour={byOpenHours[uid]}
                                                />)
                                        }
                                    </DynamicFieldSet>
                                    : openHoursDisplay
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="职员" span={2} >
                                {alterInfo ?
                                    <div>
                                        {/* <TweenOneGroup
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
                                            {byShops[shopId].clerks.map((uid) => (
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
                                                       {byShopClerks[uid].name} · {byShopClerks[uid].position.name}
                                                    </Tag>
                                                </span>))
                                            }
                                        </TweenOneGroup> */}
                                        <Form.Item>
                                            {getFieldDecorator('clerks', {
                                                initialValue: byShops[shopId].clerks ,
                                            })(<ShopClerkInput />)}
                                        </Form.Item>
                                        {/* {alterInfo && <Tag onClick={this.showModal} style={{ background: '#fff', borderStyle: 'dashed', margin: "10px" }}>
                                            <Icon type="plus" /> 添加职员
                                                    </Tag>} */}
                                    </div>
                                    : clerksDisplay
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="门店展示图片" span={2}>
                                {alterInfo ?
                                    <PictureCard
                                        onChange={this.handleDisplayChange}
                                        fileList={photoDisplay} />
                                    :
                                    <PictureCard
                                        fileList={photoDisplay}
                                        type={"display"}
                                        alterInfo={alterInfo} />
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="包厢" span={2}>
                                <div>
                                    {/* <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Link to={{
                                        pathname: `${match.url}/addBox/${shopId}`,
                                        state: { from: this.props.location }
                                    }}>
                                        <Button type="primary">新增包厢</Button>
                                    </Link>
                                </div> */}
                                    {shopBoxesDisplay}
                                </div>
                            </Descriptions.Item>
                        </Descriptions>
                        {alterInfo &&
                            <Row style={{ margin: "20px 0" }}>
                                <Col span={12} offset={4}>
                                    <Button type="primary" htmlType="submit" block>确认修改</Button>
                                </Col>
                                <Col span={4} push={4}>
                                    <Button block onClick={() => this.props.finishAlterInfo()}>取消修改</Button>
                                </Col>
                            </Row>
                        }
                    </Form>}
                {/* : <Empty /> */}
                {/* } */}
                {/* </div> */}
                {/* } */}
                {/* <AddClerkModal
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
                <AlterOpenHourModal
                    visible={this.state.alterOpenHour}
                    handleStartTimePickerChange={this.handleStartTimePickerChange}
                    handleEndTimePickerChange={this.handleEndTimePickerChange}
                    handleRepeatChange={this.handleRepeatChange}
                    handleAddOpenHour={this.handleAddOpenHour}
                    handleRemoveOpenHour={this.handleRemoveOpenHour}
                    openHours={this.state.shopInfo.openHours}
                    byOpenHours={this.state.byOpenHours}
                    handleOk={() => this.handleModalOk(1)}
                    handleCancel={() => this.handleModalCancel(1)}
                /> */}
                <Prompt message="当前页面正在输入中，离开此页面您输入的数据不会被保存，是否离开?" when={alterInfo} />
            </Spin>
        );
    }

}
const mapStateToProps = (state, props) => {
    return {
        shops: getShops(state),
        byShops: getByShops(state),
        byOpenHours: getByOpenHours(state),
        byPhotos: getByPhotos(state),
        // byShopClerks: getByShopClerks(state),
        shopBoxes: getShopBoxes(state),
        byShopBoxes: getByShopBoxes(state),
        clerks:getClerks(state),
        byClerks:getByClerks(state),
        ////////////////////////////////////
        // shop: getShop(state),
        // clerks: getClerks(state),
        // byClerks: getByClerks(state),
        // requestQuantity: getRetrieveRequestQuantity(state),
        // error: getError(state),
        // shopId: getShopId_shopManagement(state),
        // addButtonVisible: getAddButtonVisible_shopManagement(state),
        // byBoxes: getBoxes(state),
        // alterInfo: getAlterInfoState(state),
        // byDisplay: getDisplay(state),
        // modalVisible: getModalVisible(state),
        // modalRequestQuantity: getModalRequestQuantity(state),
        // clientWidth: getClientWidth(state),
        // clientHeight: getClientHeight(state),
        // byShopList: getShopList(state),
        // byOpenHours: getOpenHours(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(shopActions, dispatch),
        // ...bindActionCreators(uiActions, dispatch),
        ...bindActionCreators(clerkActions, dispatch),
        ...bindActionCreators(appActions, dispatch),
    };
};
const WrapedShopDetail = Form.create({ name: 'shopDetail' })(ShopDetail);
export default connect(mapStateToProps, mapDispatchToProps)(WrapedShopDetail);