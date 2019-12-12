import React from "react";
import { Descriptions, Tree, Icon } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as clerkActions, getByClerks, getClerks, getByAuthority, getByBelong } from "../../../../../redux/modules/clerk";
import { actions as appActions, getRequestQuantity } from "../../../../../redux/modules/app";
import { actions as shopActions, getShopList } from "../../../../../redux/modules/shop";
import { actions as uiActions, getAlterInfoState } from "../../../../../redux/modules/ui";
import PictureCard from "../../../../../components/PictureCard";

const { TreeNode } = Tree;

class RoleDetail extends React.Component {
    getFileList = (item) => {
        return [{
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: item,
        }];
    }

    fileListOnChange = (fileList) => {
        console.log("file list on change", fileList);
    }

    render() {
        const { byClerks, match, alterInfo, byShopList, byAuthority, byBelong } = this.props;
        const { clerkId } = match.params;
        const fileList = this.getFileList(byClerks[clerkId].avatar);
        return (
            <div style={{ margin: "20px 0" }}>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="姓名">
                        {byClerks[clerkId].name}
                    </Descriptions.Item>
                    <Descriptions.Item label="性别">
                        {byClerks[clerkId].sex}
                    </Descriptions.Item>
                    <Descriptions.Item label="所属门店">
                        {!alterInfo ?
                            byClerks[clerkId].shopId ? byShopList[byClerks[clerkId].shopId].name : "暂未分配门店"
                            : null
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="职位">
                        {!alterInfo ?
                            byClerks[clerkId].position ? byClerks[clerkId].position : "暂未分配职位"
                            : null
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="权限" span={2}>
                        {!alterInfo ?
                            <div>
                                <div>
                                    <Tree
                                        showLine
                                        switcherIcon={<Icon type="down" />}
                                    >
                                        {
                                            byClerks[clerkId].belong.map((belongId) => (
                                                <TreeNode title={byBelong[belongId].title} key={byBelong[belongId].name}>
                                                    {byClerks[clerkId].authority.map((authorityId) => {
                                                        if (byAuthority[authorityId].belong !== belongId) {
                                                            return null;
                                                        }
                                                        return (
                                                            <TreeNode title={byAuthority[authorityId].title} key={byAuthority[authorityId].name} />
                                                        )
                                                    })}
                                                </TreeNode>
                                            ))
                                        }
                                    </Tree>
                                </div>
                                <div style={{ float: "right",height:"100%" }}>
                                    asdf
                                </div>
                            </div>
                            : null
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="联系方式">
                        {byClerks[clerkId].contact}
                    </Descriptions.Item>
                    <Descriptions.Item label="身份证号">
                        {byClerks[clerkId].identityId}
                    </Descriptions.Item>
                    <Descriptions.Item label="照片">
                        <PictureCard
                            alterInfo={alterInfo}
                            fileList={fileList}
                            max={1}
                            onChange={this.fileListOnChange}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="家庭住址">
                        {byClerks[clerkId].address}
                    </Descriptions.Item>
                </Descriptions>
            </div >
        )
    }
}
const mapStateToProps = (state, props) => {
    return {
        byClerks: getByClerks(state),
        clerks: getClerks(state),
        requestQuantity: getRequestQuantity(state),
        byShopList: getShopList(state),
        alterInfo: getAlterInfoState(state),
        byAuthority: getByAuthority(state),
        byBelong: getByBelong(state),
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