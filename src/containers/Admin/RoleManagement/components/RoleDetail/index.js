import React from "react";
import { Descriptions, Tree, Icon, Row, Col, Typography, Button, Spin, Input, Select, Empty, Form } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
    actions as clerkActions,
    getByClerks,
    getClerks,
    getByAuthority,
    getByBelong,
    getAllAuthority,
    getAllBelong,
    getAllPosition,
    getByAllPosition
} from "../../../../../redux/modules/clerk";
import { actions as appActions, getRequestQuantity } from "../../../../../redux/modules/app";
import { actions as shopActions, getShopList, getShop } from "../../../../../redux/modules/shop";
import { actions as uiActions, getAlterInfoState } from "../../../../../redux/modules/ui";
import PictureCard from "../../../../../components/PictureCard";
import TableTransfer from "../../../../../components/TableTransfer";
import { sex } from "../../../../../utils/common";
import { validateContact, validateId } from "../../../../../utils/stringUtil";

const { TreeNode } = Tree;
const { Title, Paragraph } = Typography;
const { Option } = Select;

const leftTableColumns = [
    {
        dataIndex: 'title',
        title: '权限名称',
    },
    {
        dataIndex: 'description',
        title: '描述',
    },
];
const rightTableColumns = [
    {
        dataIndex: 'title',
        title: '权限名称',
    },
];

class RoleDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAuthority: null,
            validateStatus: {
                name: "success",
                contact: "success",
                identityId: "success",
                address: "success",
            }
        }
    }

    getFileList = (item) => {
        return item != null ? [{
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: item,
        }] : [];
    }

    componentDidMount() {
        const { byClerks, match, } = this.props;
        const { clerkId } = match.params;
        this.setState({ ...byClerks[clerkId] });
    }

    getTableTransferDatasource = () => {
        const { allAuthority, byAuthority } = this.props;
        let mockData = new Array();
        if (allAuthority != null && allAuthority.length !== 0) {
            allAuthority.forEach((item) => {
                if (!byAuthority[item]) {
                    return;
                }
                mockData.push({
                    key: item,
                    title: byAuthority[item].title,
                    description: byAuthority[item].description,
                });
            });
        }
        return mockData;
    }

    fileListOnChange = (fileList) => {
        // console.log("file list on change", fileList);
        this.setState({ avatar: fileList.length === 0 ? null : fileList[0].url })
    }


    onSelect = (selectedKeys, info) => {
        // console.log('selected', selectedKeys, info);
        if (info.node.props.uid) {
            this.setState({ selectedAuthority: info.node.props.uid });
        }
    };

    completeAlter = () => {
        const newRoleDetail = this.state;
        const {validateStatus}=this.state;
        // console.log("complete alter role detail", newRoleDetail);
        for (var key in validateStatus) {
            if (validateStatus[key]!=="success") {
                this.props.callMessage("error","您输入的信息有误!");
                return;
            }
            // console.log("key in new role detail", key);
        }
        this.props.alterClerkInfo(newRoleDetail)
        .then(()=>{
            this.props.callMessage("success","修改成功！");
        })
        .catch((err)=>{
            this.props.callMessage("error",err);
        });
    }

    handleCancelAlter = () => {
        // console.log("cancel alter role detail");
        this.props.finishAlterInfo();
    }


    onTransferChange = nextTargetKeys => {
        // console.log("next target kes", nextTargetKeys);
        const {byAuthority}=this.props;
        let belong=new Array();
        nextTargetKeys.forEach((item)=>{
            if(belong.indexOf(byAuthority[item].belong)===-1){
                belong.push(byAuthority[item].belong);
            }
        })
        this.setState({ authority: nextTargetKeys,belong });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        // console.log("input change:", name, "value length:", value.length);
        const validateStatus = {
            ...this.state.validateStatus,
            [name]: value.length === 0 ? "error" : this.validateInput(name, value) ? "success" : "warning"
        };
        this.setState({
            [name]: e.target.value,
            validateStatus
        })
    }

    //验证输入格式
    validateInput = (name, value) => {
        switch (name) {
            case "contact":
                return validateContact(value);
            case "identityId":
                return validateId(value);
            default:
                return true;
        }
    }

    handleSelectSexChange = (value) => {
        // console.log("select sex", value);
        this.setState({ sex: value });
    }

    onSelectPositionChange = (value) => {
        // console.log("select position", value);
        const { byallPosition } = this.props;
        this.setState({ position: byallPosition[value] });
    }

    onSelectShopChange = (value) => {
        // console.log("select shop", value);
        this.setState({ shopId: value });
    }

    render() {
        const { byClerks, match, alterInfo, byShopList, allPosition, byallPosition,
            byAuthority, byBelong, requestQuantity, shop } = this.props;
        const { clerkId } = match.params;
        const fileListInProps = this.getFileList(byClerks[clerkId].avatar);
        const fileListInState = this.getFileList(this.state.avatar);
        const { selectedAuthority, authority, validateStatus } = this.state;
        const dataSource = this.getTableTransferDatasource();
        return (
            <div style={{ margin: "20px 0" }}>
                <Spin spinning={requestQuantity > 0}>
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="姓名">
                            {!alterInfo ?
                                byClerks[clerkId].name
                                : <Form.Item
                                    validateStatus={validateStatus.name}
                                    help={validateStatus.name === "success" ? null : "请输入姓名！"}>
                                    <Input value={this.state.name} allowClear name="name" onChange={this.handleInputChange} />
                                </Form.Item>
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="性别">
                            {!alterInfo ?
                                sex[byClerks[clerkId].sex]
                                : <Select defaultValue={this.state.sex} style={{ width: 120 }} onChange={this.handleSelectSexChange}>
                                    <Option value="0">{sex["0"]}</Option>
                                    <Option value="1">{sex["1"]}</Option>
                                </Select>
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="所属门店">
                            {!alterInfo ?
                                byClerks[clerkId].shopId ? byShopList[byClerks[clerkId].shopId].name : "暂未分配门店"
                                : <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    optionFilterProp="children"
                                    defaultValue={this.state.shopId}
                                    onChange={this.onSelectShopChange}
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }>
                                    {shop.shopList.map((shopId) => {
                                        return <Option value={byShopList[shopId].uid} key={byShopList[shopId].uid}>{byShopList[shopId].name}</Option>
                                    })}
                                </Select>
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="职位">
                            {!alterInfo ?
                                byClerks[clerkId].position ? byClerks[clerkId].position.name : "暂未分配职位"
                                : <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    optionFilterProp="children"
                                    defaultValue={this.state.position!=undefined&&this.state.position.uid}
                                    onChange={this.onSelectPositionChange}
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }>
                                    {allPosition != null && allPosition.length != 0 && allPosition.map((uid) => {
                                        return <Option value={uid} key={uid}>{byallPosition[uid].name}</Option>
                                    })}
                                </Select>
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="权限" span={2}>
                            {!alterInfo ?
                                <Row>
                                    <Col span={8}>
                                        <Tree
                                            showLine
                                            switcherIcon={<Icon type="down" />}
                                            onSelect={this.onSelect}
                                        >
                                            {
                                                byClerks[clerkId].belong.map((belongId) => (
                                                    <TreeNode title={byBelong[belongId].title} key={byBelong[belongId].name}>
                                                        {byClerks[clerkId].authority.map((authorityId) => {
                                                            if (byAuthority[authorityId].belong !== belongId) {
                                                                return null;
                                                            }
                                                            return (
                                                                <TreeNode title={byAuthority[authorityId].title} key={byAuthority[authorityId].name} id={authorityId} />
                                                            )
                                                        })}
                                                    </TreeNode>
                                                ))
                                            }
                                        </Tree>
                                    </Col>
                                    <Col span={16}>
                                        {selectedAuthority != null ?
                                            <div>
                                                <Title level={4}>{byAuthority[selectedAuthority].title}</Title>
                                                <Paragraph>{byAuthority[selectedAuthority].description}</Paragraph>
                                            </div>
                                            : null
                                        }
                                    </Col>
                                </Row>
                                : <TableTransfer
                                    dataSource={dataSource}
                                    targetKeys={authority}
                                    titles={["未拥有权限", "已拥有权限"]}
                                    showSearch={true}
                                    onChange={this.onTransferChange}
                                    filterOption={(inputValue, item) =>
                                        item.title.indexOf(inputValue) !== -1 || item.tag.indexOf(inputValue) !== -1
                                    }
                                    leftColumns={leftTableColumns}
                                    rightColumns={rightTableColumns}
                                />
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="联系方式">
                            {!alterInfo ?
                                byClerks[clerkId].contact
                                : <Form.Item
                                    validateStatus={validateStatus.contact}
                                    help={validateStatus.contact === "success" ?
                                        null : validateStatus.contact === "warning" ? "手机号不合法！" : "请输入联系方式！"}>
                                    <Input value={this.state.contact} allowClear name="contact" onChange={this.handleInputChange} />
                                </Form.Item>
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="身份证号">
                            {!alterInfo ?
                                byClerks[clerkId].identityId
                                : <Form.Item
                                    validateStatus={validateStatus.identityId}
                                    help={validateStatus.identityId === "success" ?
                                        null : validateStatus.identityId === "warning" ? "身份证号不合法" : "请输入身份证号！"}>
                                    <Input value={this.state.identityId} allowClear name="identityId" onChange={this.handleInputChange} />
                                </Form.Item>
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="照片">
                            {alterInfo ?
                                <PictureCard
                                    fileList={fileListInState}
                                    alterInfo={alterInfo}
                                    p="state"
                                    max={1}
                                    onChange={this.fileListOnChange} />
                                : byClerks[clerkId].avatar == null ?
                                    <Empty />
                                    : <PictureCard
                                        fileList={fileListInProps}
                                        p="props"
                                        alterInfo={alterInfo}
                                        max={1}
                                        onChange={this.fileListOnChange} />
                            }
                            {/* <PictureCard
                                alterInfo={alterInfo}
                                fileList={fileList}
                                max={1}
                                onChange={this.fileListOnChange}
                            /> */}
                        </Descriptions.Item>
                        <Descriptions.Item label="家庭住址">
                            {!alterInfo ?
                                byClerks[clerkId].address
                                : <Form.Item
                                    validateStatus={validateStatus.address}
                                    help={validateStatus.address === "success" ? null : "请输入地址！"}>
                                    <Input value={this.state.address} allowClear name="address" onChange={this.handleInputChange} />
                                </Form.Item>
                            }
                        </Descriptions.Item>
                    </Descriptions>
                    {alterInfo &&
                        <Row style={{ margin: "20px 0" }}>
                            <Col span={12} offset={4}>
                                <Button type="primary" block onClick={this.completeAlter} >{requestQuantity > 0 ? "" : "确认修改"}</Button>
                            </Col>
                            <Col span={4} push={4}>
                                <Button block onClick={this.handleCancelAlter}>取消修改</Button>
                            </Col>
                        </Row>
                    }
                </Spin>
            </div >
        )
    }
}
const mapStateToProps = (state, props) => {
    return {
        byClerks: getByClerks(state),
        clerks: getClerks(state),
        requestQuantity: getRequestQuantity(state),
        shop: getShop(state),
        byShopList: getShopList(state),
        alterInfo: getAlterInfoState(state),
        byAuthority: getByAuthority(state),
        byBelong: getByBelong(state),
        allAuthority: getAllAuthority(state),
        allPosition: getAllPosition(state),
        byallPosition: getByAllPosition(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(clerkActions, dispatch),
        ...bindActionCreators(appActions, dispatch),
        ...bindActionCreators(shopActions, dispatch),
        ...bindActionCreators(uiActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleDetail);