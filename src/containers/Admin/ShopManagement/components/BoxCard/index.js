import { Card, Icon, Avatar, Tooltip, Carousel } from 'antd';
import React from "react";
import { Link } from "react-router-dom";

const { Meta } = Card;

class BoxCard extends React.Component {
    render() {
        const { alterInfo, boxInfo, match, shopId } = this.props;
        return (
            <Card
                style={{ width: 150, display: "inline-block", margin: "10px" }}
                size="small"
                cover={
                    <Carousel autoplay>
                        {boxInfo.img.map((img, index) => (
                            <img
                                key={index}
                                alt="example"
                                src={img.url}
                            />
                        ))}
                    </Carousel>
                }
                actions={ [
                    <Tooltip title="删除包厢"><Icon type="delete" key="delete" /></Tooltip>,
                    <Tooltip title="修改包厢信息"><Icon type="edit" key="edit" /></Tooltip>,
                ] }
            >
                <Meta
                    avatar={
                        <Link to={`${match.url}/boxInfo/${shopId}/${boxInfo.id}`}>
                            <Tooltip title="点击查看包厢信息">
                                <Icon type="info-circle" key="info-circle" />
                            </Tooltip>
                        </Link>
                    }
                    title={boxInfo.name}
                />
            </Card>
        )
    }
}

export default BoxCard;
