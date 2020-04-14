import React from "react";
import {
    Descriptions, Tooltip, Empty, Spin, Button,
    Input, Row, Col, Tag, Form, Skeleton, Modal
} from "antd";
import { Link, Prompt } from "react-router-dom";
import PictureCard from "../../../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getShops, getByShops, getByOpenHours, getByPhotos, getShopBoxes, getByShopBoxes } from "../../../../../redux/modules/shop";
import { actions as clerkActions, getByClerks, getClerks } from "../../../../../redux/modules/clerk";
import { convertToDay } from "../../../../../utils/commonUtils";
import { map } from "../../../../../router";
import "./style.css";
import DynamicFieldSet from "../../../../../components/DynamicFieldSet";
import ShopOpenHour from "../../../../../components/ShopOpenHour";
import ShopClerkInput from "./components/ShopClerkInput";
import ShopBoxInput from "./components/ShopBoxInput";
import validator from "../../../../../utils/validator";

const { confirm } = Modal;

class ShopDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: new Array(),
        }
    }

    componentDidMount() {
        const { shopId } = this.props.match.params;
        this.props.fetchShop(shopId)
            .then(() => {
                this.setState({ fileList: this.props.byShops[shopId].photos })
            })
            .catch(err=>this.props.callMessage("error",err));
    }

    getOpenHoursDisplay = () => {
        const { shopId } = this.props.match.params;
        const { byShops, byOpenHours } = this.props;
        let openHoursDisplay = null;
        try {
            openHoursDisplay = byShops[shopId].openHours.map(uid =>
                <div key={uid}>
                    {byOpenHours[uid].startTime}~{byOpenHours[uid].endTime}&nbsp;&nbsp;
                {byOpenHours[uid].date != undefined ?
                        convertToDay(byOpenHours[uid].date)
                        : null}
                </div>
            )
        } catch (err) {
            openHoursDisplay = null;
        }
        return openHoursDisplay
    }

    getClerksDisplay = () => {
        const { shopId } = this.props.match.params;
        const { byClerks, byShops } = this.props;
        let clerksDisplay = <Empty />;
        try {
            clerksDisplay = byShops[shopId].clerks.map((uid) => (
                <Tooltip key={uid} title={"点击查看员工详情"} placement="topLeft">
                    <Link to={`${map.admin.AdminHome()}/clerk_management/clerks/${uid}`}>
                        <Tag color="purple" onClick={this.showClerkInfo} style={{ margin: "10px" }}>
                            {byClerks[uid].name} · {byClerks[uid].position == null || byClerks[uid].position == undefined ? "暂未分配职务" : byClerks[uid].position.name}
                        </Tag></Link>
                </Tooltip>
            ))
        } catch (err) {
            clerksDisplay = <Empty />;
        }
        return clerksDisplay;
    }

    getPhotosDisplay = () => {
        const { shopId } = this.props.match.params;
        const { byPhotos, byShops } = this.props;
        let photoDisplay = new Array();
        try {
            photoDisplay = byShops[shopId].photos.map((uid) => ({
                uid,
                name: 'image.png',
                status: 'done',
                type: "image/jpeg",
                thumbUrl: `data:image/png;base64,${byPhotos[uid].photo}`,
            }))
        } catch (err) {
            photoDisplay = new Array();
        }
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
        const { fileList } = this.state;
        const { shopId } = this.props.match.params;
        const { byShops } = this.props;
        const thiz = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                confirm({
                    title: '确认修改?',
                    content: '输入数据是否无误，确认修改门店信息',
                    onCancel() {
                    },
                    onOk() {
                        const { keys } = values;
                        let openHours = new Array();
                        keys.forEach(index => {
                            let openHour = new Object();
                            for (let key in values) {
                                if (key.indexOf(index) != -1) {
                                    if (key.indexOf("date") == -1) {
                                        openHour[key.split("_")[0]] = values[key].format("HH:mm");
                                    } else {
                                        openHour[key.split("_")[0]] = values[key];
                                    }
                                }
                            }
                            openHours.push(openHour);
                        })
                        const shop = { ...values, photos: fileList, uid: shopId, openHours };
                        console.log(shop);
                        thiz.props.updateShop(shop).then(() => {
                            thiz.props.callMessage("success", "更新门店信息成功！");
                            thiz.props.finishAlterInfo();
                        }).catch((err) => {
                            thiz.props.callMessage("error", "更新门店信息失败!" + err);
                        });
                    },
                });

            }
        });
    };

    render() {
        const { shopId } = this.props.match.params;
        const { retrieveRequestQuantity, alterInfo, byShops, updateRequestQuantity, byOpenHours } = this.props;
        const { getFieldDecorator } = this.props.form;
        const isDataNull = byShops[shopId] == undefined || byShops[shopId] == null;
        const openHoursDisplay = this.getOpenHoursDisplay();
        const clerksDisplay = this.getClerksDisplay();
        const photoDisplay = this.getPhotosDisplay();
        const shopBoxesDisplay = this.getShopBoxesDisplay();
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
                                            rules: [{ required: true, message: '请输入门店联系方式!' },validator.phone],
                                            initialValue: byShops[shopId].contact
                                        })(<Input allowClear name="contact" placeholder="请输入门店联系方式" />)}
                                    </Form.Item>
                                    : isDataNull ? null:byShops[shopId].contact}
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
                                    <Form.Item>
                                        {getFieldDecorator('clerks', {
                                            initialValue: byShops[shopId].clerks,
                                        })(<ShopClerkInput />)}
                                    </Form.Item>
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
                                        type={"display"} />
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="包厢" span={2}>
                                {alterInfo ?
                                    <Form.Item>
                                        {getFieldDecorator('shopBoxes', {
                                            initialValue: byShops[shopId].shopBoxes,
                                        })(<ShopBoxInput />)}
                                    </Form.Item>
                                    : shopBoxesDisplay
                                }
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
                <Prompt message="当前页面正在输入中，离开此页面您输入的数据不会被保存，是否离开?" when={alterInfo} />
            </Spin>
        );
    }

}
const mapStateToProps = (state) => {
    return {
        shops: getShops(state),
        byShops: getByShops(state),
        byOpenHours: getByOpenHours(state),
        byPhotos: getByPhotos(state),
        shopBoxes: getShopBoxes(state),
        byShopBoxes: getByShopBoxes(state),
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
const WrapedShopDetail = Form.create({ name: 'shopDetail' })(ShopDetail);
export default connect(mapStateToProps, mapDispatchToProps)(WrapedShopDetail);