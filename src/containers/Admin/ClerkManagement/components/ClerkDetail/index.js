import React from "react";
import { Descriptions, Row, Col, Skeleton, Button, Spin, Input, Select, Form, Modal, Radio } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as clerkActions, getClerks, getByClerks, getPositions, getByPositions } from "../../../../../redux/modules/clerk";
import { actions as shopActions, getShops, getByShops } from "../../../../../redux/modules/shop";
import { Prompt, Redirect } from "react-router-dom";
import PictureCard from "../../../../../components/PictureCard";
import { sex } from "../../../../../utils/common";

const { Option } = Select;
const { confirm } = Modal;

class ClerkDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: new Array(),
            from: null,
        }
    }

    componentDidMount() {
        const { clerkId } = this.props.match.params;
        this.props.fetchShops();
        this.props.fetchPositions();
        this.props.fetchClerk(clerkId).then(() => {
            this.setState({ fileList: this.props.byClerks[clerkId].avatar == null ? new Array() : [this.props.byClerks[clerkId].avatar.uid] });
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        const { fileList } = this.state;
        const { clerkId } = this.props.match.params;
        const thiz = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                confirm({
                    title: '确认修改?',
                    content: '输入数据是否无误，确认修改该产品信息',
                    onCancel() {
                    },
                    onOk() {
                        const clerk = { ...values, avatar: fileList.length > 0 ? fileList[0] : null, uid: clerkId };
                        console.log("submit values", clerk);
                        thiz.props.updateClerk(clerk).then(() => {
                            thiz.props.callMessage("success", "更新职员信息成功！");
                            thiz.props.finishAlterInfo();
                        }).catch((err) => {
                            thiz.props.callMessage("error", "更新职员信息失败!" + err);
                        });
                    },
                });

            }
        });
    };

    getPhotosDisplay = () => {
        const { clerkId } = this.props.match.params;
        const { byClerks } = this.props;
        let photoDisplay = new Array();
        try {
            photoDisplay = [{
                uid: byClerks[clerkId].avatar.uid,
                name: 'image.png',
                status: 'done',
                type: "image/jpeg",
                thumbUrl: `data:image/png;base64,${byClerks[clerkId].avatar.photo}`,
            }]
        } catch{
            photoDisplay = new Array();
        }
        return photoDisplay;
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
        const { clerkId } = this.props.match.params;
        const { alterInfo, retrieveRequestQuantity, form, byClerks,
            updateRequestQuantity, shops, byShops, positions, byPositions } = this.props;
        const { getFieldDecorator } = form;
        const photoDisplay = this.getPhotosDisplay();
        return (
            <div>
                <Spin spinning={updateRequestQuantity > 0}>
                    {retrieveRequestQuantity > 0 ?
                        <Skeleton active /> :
                        <Form onSubmit={this.handleSubmit}>
                            <Descriptions bordered column={2} style={{ marginBottom: "20px" }}>
                                <Descriptions.Item label="姓名">
                                    {
                                        !alterInfo ?
                                            byClerks[clerkId].name
                                            : <Form.Item>
                                                {getFieldDecorator('name', {
                                                    rules: [{ required: true, message: '请输入姓名!' }],
                                                    initialValue: byClerks[clerkId].name
                                                })(<Input name="name" allowClear placeholder="请输入姓名" />)}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="性别" >
                                    {
                                        !alterInfo ?
                                            sex[byClerks[clerkId].sex]
                                            : <Form.Item>
                                                {getFieldDecorator('sex', {
                                                    rules: [{ required: true, message: '请选择性别!' }],
                                                    initialValue: byClerks[clerkId].sex
                                                })(<Radio.Group>
                                                    <Radio value={0}>{sex[0]}</Radio>
                                                    <Radio value={1}>{sex[1]}</Radio>
                                                </Radio.Group>)}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="联系方式">
                                    {
                                        !alterInfo ?
                                            byClerks[clerkId].contact
                                            : <Form.Item>
                                                {getFieldDecorator('contact', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请输入联系方式！",
                                                        }
                                                    ],
                                                    initialValue: byClerks[clerkId].contact
                                                })(
                                                    <Input allowClear />
                                                )}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="身份证号">
                                    {
                                        !alterInfo ?
                                            byClerks[clerkId].identityId :
                                            <Form.Item>
                                                {getFieldDecorator('identityId', {
                                                    rules: [{ required: true, message: '请输入身份证号!' }],
                                                    initialValue: byClerks[clerkId].identityId
                                                })(<Input allowClear />)}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="住址" span={2}>
                                    {
                                        !alterInfo ?
                                            byClerks[clerkId].address :
                                            <Form.Item>
                                                {getFieldDecorator('address', {
                                                    rules: [{ required: true, message: '请输入职员住址!' }],
                                                    initialValue: byClerks[clerkId].address
                                                })(<Input.TextArea rows={3} allowClear />)}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="所属门店">
                                    {
                                        !alterInfo ?
                                            byClerks[clerkId].shop == null ? "暂未分配门店" : byClerks[clerkId].shop.name :
                                            <Form.Item>
                                                {getFieldDecorator('shop', {
                                                    initialValue: byClerks[clerkId].shop==null?null:byClerks[clerkId].shop.uid
                                                })(
                                                    <Select>
                                                        {shops.map(uid => <Option key={uid} value={uid}>{byShops[uid].name}</Option>)}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="职位">
                                    {
                                        !alterInfo ?
                                            byClerks[clerkId].position == null ? "暂未分配职位" : byClerks[clerkId].position.name
                                            : <Form.Item >
                                                {getFieldDecorator('position', {
                                                    initialValue:byClerks[clerkId].position==null?null: byClerks[clerkId].position.uid
                                                })(
                                                    <Select placeholder="请选择职位">
                                                        {
                                                            positions.map((uid) => (
                                                                <Option key={uid} value={uid}>{byPositions[uid].name}</Option>
                                                            ))
                                                        }
                                                    </Select>,
                                                )}
                                            </Form.Item>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="照片">
                                    {
                                        alterInfo ?
                                            <PictureCard
                                                onChange={this.handleDisplayChange}
                                                max={1}
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

const mapStateToProps = (state) => {
    return {
        clerks: getClerks(state),
        byClerks: getByClerks(state),
        shops: getShops(state),
        byShops: getByShops(state),
        positions: getPositions(state),
        byPositions: getByPositions(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(clerkActions, dispatch),
        ...bindActionCreators(shopActions, dispatch),
    };
};

const WrapedClerkDetail = Form.create({ name: 'clerkDetail' })(ClerkDetail);
export default connect(mapStateToProps, mapDispatchToProps)(WrapedClerkDetail);