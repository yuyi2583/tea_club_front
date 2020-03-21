import { Card, Icon, Avatar, Tooltip, Carousel } from 'antd';
import React from "react";
import { Link, Prompt } from "react-router-dom";

const { Meta } = Card;

class ShopBoxCard extends React.Component {

    deleteBox = () => {
        const { alterInfo, boxInfo, match, shopId } = this.props;
        this.props.deleteBoxInfo(shopId,boxInfo.uid);
    }

    render() {
        const { alterInfo, shopBox, match, shopId ,requestQuantity} = this.props;
        const boxInfo=shopBox;
        return (
            <div style={{ display: "inline-block" }}>
                <Card
                    style={{ width: 150, display: "inline-block", margin: "10px" }}
                    size="small"
                    cover={
                        <Carousel autoplay>
                            {shopBox.img.map((img, index) => (
                                <img
                                    key={index}
                                    alt="example"
                                    src={img.url}
                                />
                            ))}
                        </Carousel>
                    }
                    actions={[
                        <Tooltip title="删除包厢">
                            <Icon type="delete" key="delete" onClick={this.deleteBox} />
                        </Tooltip>,
                        <Link to={{
                            pathname: `${match.url}/boxInfo/${shopId}/${boxInfo.uid}`,
                            alterInfo: true
                        }}>
                            <Tooltip title="修改包厢信息"><Icon type="edit" key="edit" /></Tooltip>
                        </Link>,
                    ]}
                >
                    <Meta
                        avatar={
                            <Link to={`${match.url}/boxInfo/${shopId}/${boxInfo.uid}`}>
                                <Tooltip title="点击查看包厢信息">
                                    <Icon type="info-circle" key="info-circle" />
                                </Tooltip>
                            </Link>
                        }
                        title={boxInfo.name}
                    />
                </Card>
            </div>
        )
    }
}

export default ShopBoxCard;
