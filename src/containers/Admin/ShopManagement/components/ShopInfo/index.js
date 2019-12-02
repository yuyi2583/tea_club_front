import React from "react";
import { Descriptions, Typography, Tooltip, Empty } from "antd";
import { Link } from "react-router-dom";

const { Paragraph } = Typography;

function Content({ shopInfo, byClerks, match }) {
    console.log(match)
    return (
        <div style={{ margin: "20px 0" }}>
            {shopInfo ? <Descriptions bordered column={2}>
                <Descriptions.Item label="门店名称">{shopInfo.name}</Descriptions.Item>
                <Descriptions.Item label="地址">{shopInfo.address}</Descriptions.Item>
                <Descriptions.Item label="职员" span={2}>
                    {byClerks ? shopInfo.clerk.map((id) => (
                        <Tooltip key={id} title={byClerks[id].position + "/点击查看员工详情"} placement="topLeft">
                            <Paragraph key={id}>
                                <Link to={`${match.url}/${id}`}><div style={{ width: "100%",color:"#808080" }}>
                                    {byClerks[id].name}
                                </div></Link>
                            </Paragraph>
                        </Tooltip>
                    )) : null}
                </Descriptions.Item>
            </Descriptions> : <Empty />}
        </div>
    );
}

export default Content;