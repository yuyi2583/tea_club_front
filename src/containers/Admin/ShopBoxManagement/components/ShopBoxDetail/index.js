import React from "react";
import { Descriptions, Row, Col, Skeleton, Button, Spin, Input, Select, Form, Modal, InputNumber } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getShopBoxes, getByShopBoxes, getByPhotos, getShops, getByShops } from "../../../../../redux/modules/shop";
import { Prompt, Redirect } from "react-router-dom";
import PictureCard from "../../../../../components/PictureCard";
import { map } from "../../../../../router";

const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

class ShopBoxDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: new Array(),
            from: null,
        }
    }

    componentDidMount() {
        const { shopBoxId } = this.props.match.params;
        this.props.fetchShopBox(shopBoxId)
            .then(() => {
                this.setState({ fileList: this.props.byShopBoxes[shopBoxId].photos });
            })
            .catch(err => {
                this.props.callMessage("error", err);
                this.setState({ from: `${map.admin.AdminHome()}/shop_management/shop_boxes` });
            });
        this.props.fetchShops()
            .catch(err => {
                this.props.callMessage("error", err);
                this.setState({ from: `${map.admin.AdminHome()}/shop_management/shop_boxes` });
            });;
    }

    handleSubmit = e => {
        e.preventDefault();
        const { fileList } = this.state;
        const { shopBoxId } = this.props.match.params;
        const { byShopBoxes } = this.props;
        const thiz = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                confirm({
                    title: '确认修改?',
                    content: '输入数据是否无误，确认修改该产品信息',
                    onCancel() {
                    },
                    onOk() {
                        const shop = { uid: values.shopId };
                        const price = { ingot: values.ingot, credit: values.credit, uid: byShopBoxes[shopBoxId].price.uid };
                        const shopBox = { ...values, price, photos: fileList, uid: shopBoxId, shop };
                        console.log("new shop box", shopBox);
                        thiz.props.updateShopBox(shopBox).then(() => {
                            thiz.props.callMessage("success", "更新包厢成功！");
                            thiz.props.finishAlterInfo();
                        }).catch((err) => {
                            thiz.props.callMessage("error", "更新包厢失败!" + err);
                        });
                    },
                });

            }
        });
    };

    getPhotosDisplay = () => {
        const { shopBoxId } = this.props.match.params;
        const { byPhotos, byShopBoxes } = this.props;
        let photoDisplay = new Array();
        try {
            photoDisplay = byShopBoxes[shopBoxId].photos.map((uid) => ({
                uid,
                name: 'image.png',
                status: 'done',
                type: "image/jpeg",
                thumbUrl: `data:image/png;base64,${byPhotos[uid].photo}`,
            }))
        } catch{
            photoDisplay = new Array();
        }
        return photoDisplay;
    }

    getPriceDisplay = () => {
        const { shopBoxId } = this.props.match.params;
        const { byShopBoxes } = this.props;
        let priceDisplay = "";
        try {
            const { price } = byShopBoxes[shopBoxId];
            if (price == null || price == undefined) {
                return priceDisplay;
            }
            if (price.ingot != 0) {
                priceDisplay += price.ingot + "元宝";
            }
            if (price.credit != 0) {
                priceDisplay += price.credit + "积分";
            }
        } catch{
            priceDisplay = "";
        }
        return priceDisplay;
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

    render() {
        const { from } = this.state;
        if (from != null) {
            return <Redirect to={from} />;
        }
        const { shopBoxId } = this.props.match.params;
        const { alterInfo, retrieveRequestQuantity, form, shops, byShops,
            updateRequestQuantity, byShopBoxes } = this.props;
        const { getFieldDecorator } = form;
        const photoDisplay = this.getPhotosDisplay();
        const priceDisplay = this.getPriceDisplay();
        const isDataNull = byShopBoxes[shopBoxId] == undefined ? true : false;
        return (
            <div>
                <Spin spinning={updateRequestQuantity > 0}>
                    {retrieveRequestQuantity > 0 ?
                        <Skeleton active /> :
                        <Form onSubmit={this.handleSubmit}>
                            <Descriptions bordered column={2} style={{ marginBottom: "20px" }}>
                                <Descriptions.Item label="包厢名称">
                                    {
                                        !alterInfo ?
                                            isDataNull ? null : byShopBoxes[shopBoxId].name
                                            : <Form.Item>
                                                {getFieldDecorator('name', {
                                                    rules: [{ required: true, message: '请输入包厢名称!' }],
                                                    initialValue: byShopBoxes[shopBoxId].name
                                                })(<Input name="name" allowClear placeholder="请输入包厢名称" />)}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="包厢编号" >
                                    {
                                        !alterInfo ?
                                            isDataNull ? null : byShopBoxes[shopBoxId].boxNum
                                            : <Form.Item>
                                                {getFieldDecorator('boxNum', {
                                                    rules: [{ required: true, message: '请输入包厢编号!' }],
                                                    initialValue: byShopBoxes[shopBoxId].boxNum
                                                })(<Input name="boxNum" allowClear placeholder="请输入包厢编号" />)}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="包厢描述" span={2}>
                                    {
                                        !alterInfo ?
                                            isDataNull ? null : byShopBoxes[shopBoxId].description
                                            : <Form.Item>
                                                {getFieldDecorator('description', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请输入包厢描述！",
                                                        }
                                                    ],
                                                    initialValue: byShopBoxes[shopBoxId].description
                                                })(
                                                    <TextArea name="description" rows={4} allowClear placeholder="请输入包厢描述" />
                                                )}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="价格/泡茶">
                                    {
                                        !alterInfo ?
                                            isDataNull ? null : priceDisplay :
                                            <div>
                                                <Form.Item>
                                                    {getFieldDecorator('ingot', {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: "请输入包厢价格！",
                                                            }
                                                        ],
                                                        initialValue: byShopBoxes[shopBoxId].price.ingot
                                                    })(
                                                        <InputNumber name="ingot" min={0} allowClear />
                                                    )}元宝
                                                </Form.Item>
                                                <Form.Item>
                                                    {getFieldDecorator('credit', {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: "请输入包厢价格！",
                                                            }
                                                        ],
                                                        initialValue: byShopBoxes[shopBoxId].price.credit
                                                    })(
                                                        <InputNumber name="credit" min={0} allowClear />
                                                    )}积分
                                                </Form.Item>
                                            </div>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="一泡茶时间（分钟）">
                                    {
                                        !alterInfo ?
                                            isDataNull ? null : byShopBoxes[shopBoxId].duration :
                                            <Form.Item>
                                                {getFieldDecorator('duration', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请输入一泡茶时间！",
                                                        }
                                                    ],
                                                    initialValue: byShopBoxes[shopBoxId].duration
                                                })(
                                                    <InputNumber name="duration" min={0} allowClear />
                                                )}分钟
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="所属门店" span={2}>
                                    {
                                        !alterInfo ?
                                            isDataNull ? null : byShopBoxes[shopBoxId].shop == null ? null : byShopBoxes[shopBoxId].shop.name :
                                            <Form.Item>
                                                {getFieldDecorator('shopId', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请选择包厢所属门店！",
                                                        }
                                                    ],
                                                    initialValue: byShopBoxes[shopBoxId].shop.uid
                                                })(
                                                    <Select name="shopId">
                                                        {shops.filter(uid => !byShops[uid].enforceTerminal).map(uid => <Option key={uid} value={uid}>{byShops[uid].name}</Option>)}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="照片" span={2}>
                                    {
                                        alterInfo ?
                                            <PictureCard
                                                onChange={this.handleDisplayChange}
                                                fileList={photoDisplay} />
                                            : <PictureCard
                                                fileList={photoDisplay}
                                                type={"display"}
                                                alterInfo={alterInfo} />
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
                        </Form>
                    }
                </Spin>
                <Prompt message="当前页面正在输入中，离开此页面您输入的数据不会被保存，是否离开?" when={alterInfo} />
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        shopBoxes: getShopBoxes(state),
        byShopBoxes: getByShopBoxes(state),
        byPhotos: getByPhotos(state),
        shops: getShops(state),
        byShops: getByShops(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(shopActions, dispatch),
    };
};

const WrapedShopBoxDetail = Form.create({ name: 'shopBoxDetail' })(ShopBoxDetail);
export default connect(mapStateToProps, mapDispatchToProps)(WrapedShopBoxDetail);