import React from "react";
import { Descriptions } from "antd";

function Content({ shopInfo, byClerks }) {
    return (
        <div style={{ margin: "20px 0" }}>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="门店名称">{shopInfo.name}</Descriptions.Item>
                <Descriptions.Item label="地址">{shopInfo.address}</Descriptions.Item>
                <Descriptions.Item label="职员" span={2}>
                    {byClerks?shopInfo.clerk.map((id)=>(
                        <div key={id}>{byClerks[id].position}:{byClerks[id].name}</div>
                    )):null}
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
}

export default Content;