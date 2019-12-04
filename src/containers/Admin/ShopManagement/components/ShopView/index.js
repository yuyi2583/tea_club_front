import React from "react";
import {
    Descriptions,
    Typography,
    Tooltip,
    Empty,
    Select,
    Spin,
    Button,
    Input,
    Row,
    Col,
    Tag,
    Upload,
    Icon,
    Modal
} from "antd";
import { Link } from "react-router-dom";
import { TweenOneGroup } from 'rc-tween-one';
import { getBase64 } from "../../../../../utils/imageUtil";

const { Option } = Select;

class ShopView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shopInfo: { ...this.props.shopInfo },
            previewVisible: false,
            previewImage: '',
        }
    }
    onChange = (value) => {
        this.props.onChange(value);
    }
    handleClickClerk = () => {
        this.props.handleClickClerk();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.shopInfo !== state.shopInfo) {
            return {
                shopInfo: { ...props.shopInfo }
            };
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

    componentWillUnmount() {
        this.props.finishAlterInfo();
    }

    handleChange = (e) => {
        const name = e.target.name;
        this.setState({
            [name]: e.target.value
        })
    }

    handleRemoveClerk = (removeTag) => {
        this.props.handleRemoveClerk(removeTag);
    }

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    forDisplay=(displayId)=>{
        const {byDisplay}=this.props;
        return byDisplay[displayId];
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handleDisplayChange = ({ fileList }) => {
        console.log("change diaplay");
        console.log(fileList);
        let display=[];
        for(var key in fileList){
            display.push(fileList[key].id);
        }
        this.props.setDisplay(display);
    };

    render() {
        const { shopInfo, byClerks, match, shopId, shopListInArray, requestQuantity, boxesInArray, alterInfo } = this.props;
        const fileList=shopInfo==null?[]:shopInfo.display.map(this.forDisplay);
        const { previewVisible, previewImage } = this.state;
        const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传</div>
            </div>
          );
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
                                            <Input value={this.state.name} allowClear name="name" onChange={this.handleChange} />
                                            : shopInfo.name}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="地址">
                                        {alterInfo ?
                                            <Input value={this.state.address} allowClear name="address" onChange={this.handleChange} />
                                            : shopInfo.address}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="介绍" span={2}>
                                        {alterInfo ?
                                            <Input.TextArea rows={3} value={this.state.introduction} allowClear name="introduction" onChange={this.handleChange} />
                                            : shopInfo.introduction}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="营业时间">
                                        {alterInfo ?
                                            <Input value={this.state.businessHours} allowClear name="businessHours" onChange={this.handleChange} />
                                            : shopInfo.businessHours}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="联系方式">
                                        {alterInfo ?
                                            <Input value={this.state.contact} allowClear name="contact" onChange={this.handleChange} />
                                            : shopInfo.contact}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="职员" span={2} >
                                        {alterInfo ?
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

                                                {shopInfo.clerk.map((id) => (
                                                    <span key={id} style={{ display: 'inline-block' }}>
                                                        <Tag
                                                            closable
                                                            style={{ margin: "10px" }}
                                                            onClose={e => {
                                                                e.preventDefault();
                                                                this.handleRemoveClerk(id);
                                                            }}
                                                        >
                                                            {byClerks[id].name}
                                                        </Tag>
                                                    </span>))
                                                }
                                            </TweenOneGroup>
                                            : shopInfo.clerk.length != 0 && byClerks != null ? shopInfo.clerk.map((id) => (
                                                <Tooltip key={id} title={byClerks[id].position + "/点击查看员工详情"} placement="topLeft">
                                                    <Link to={`${match.url}/${shopId}/${id}`}><span onClick={this.handleClickClerk} style={{ margin: "10px", color: "#808080" }}>
                                                        {byClerks[id].name}
                                                    </span></Link>
                                                </Tooltip>
                                            )) : <Empty />}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="门店展示图片" span={2}>
                                        {shopInfo.display == null || shopInfo.display.length == 0 ?
                                            <Empty />
                                            : <div className="clearfix">
                                                <Upload
                                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                    listType="picture-card"
                                                    fileList={fileList}
                                                    onPreview={this.handlePreview}
                                                    onChange={this.handleDisplayChange}
                                                >
                                                    {fileList.length >= 4 ? null : uploadButton}
                                                </Upload>
                                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                                </Modal>
                                            </div>
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
            </div>
        );
    }

}


export default ShopView;