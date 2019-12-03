import React from "react";
import {Descriptions,Avatar} from "antd";

function ClerkView({ match, byClerks }) {
    const { shopId, clerkId } = match.params;
    const clerk=byClerks[clerkId];
    return (
        <div style={{ margin: "20px 0" }}>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="姓名">{clerk.name}</Descriptions.Item>
                <Descriptions.Item label="性别">{clerk.sex}</Descriptions.Item>
                <Descriptions.Item label="职位">{clerk.position}</Descriptions.Item>
                <Descriptions.Item label="联系方式">{clerk.contact}</Descriptions.Item>
                <Descriptions.Item label="身份证号">{clerk.identityId}</Descriptions.Item>
                <Descriptions.Item label="照片"><Avatar src={clerk.avatar} shape="square" style={{width:"80px",height:"80px"}} /></Descriptions.Item>
                <Descriptions.Item label="家庭住址">{clerk.address}</Descriptions.Item>
            </Descriptions>
        </div>
    )

}

export default ClerkView;