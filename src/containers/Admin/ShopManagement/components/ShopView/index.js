import React from "react";
import { Descriptions, Typography, Tooltip, Empty, Select, Spin } from "antd";
import { Link } from "react-router-dom";
import renderEmpty from "antd/lib/config-provider/renderEmpty";

const { Paragraph } = Typography;
const { Option } = Select;

class ShopView extends React.Component {
    onChange=(value)=>{
        this.props.onChange(value);
    }
    render() {
        const { shopInfo, byClerks, match, shopId, shopListInArray, requestQuantity } = this.props;
        return (
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
                {requestQuantity > 0 ?
                    <div style={{ width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}><Spin size="large" /></div> :
                    <div style={{ margin: "20px 0" }}>
                        {shopId==""||shopId=="请选择门店"?<Empty description="请选择门店" />:shopInfo ? <Descriptions bordered column={2}>
                            <Descriptions.Item label="门店名称">{shopInfo.name}</Descriptions.Item>
                            <Descriptions.Item label="地址">{shopInfo.address}</Descriptions.Item>
                            <Descriptions.Item label="职员" span={2}>
                                {byClerks ? shopInfo.clerk.map((id) => (
                                    <Tooltip key={id} title={byClerks[id].position + "/点击查看员工详情"} placement="topLeft">
                                        <Paragraph key={id}>
                                            <Link to={`${match.url}/${shopId}/${id}`}><div style={{ width: "100%", color: "#808080" }}>
                                                {byClerks[id].name}
                                            </div></Link>
                                        </Paragraph>
                                    </Tooltip>
                                )) : null}
                            </Descriptions.Item>
                        </Descriptions> : <Empty />}
                    </div>
                }
            </div>
        );
    }

}

export default ShopView;