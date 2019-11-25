import React from "react";
import { Layout, Icon, Row, Col, Avatar, Badge, Popover, Button } from 'antd';
import "./style.css";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as uiActions, getMessageDrawerState } from "../../redux/modules/ui";
import { Link } from "react-router-dom";
import { map } from "../../router";

const { Header } = Layout;

class AdminHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick = () => {
        this.props.openMessageDrawer();
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: map.admin.AdminHome() } };
        const content = (
            <div>
                <Button type="link" block className="avatar-content">
                    <Icon type="setting" />
                    <Link to={{
                        pathname: map.admin.AdminAlterPsw(),
                        state: { from }
                    }}>
                        &nbsp;&nbsp;修改密码
                    </Link>
                </Button>
                <Button type="link" block className="avatar-content">
                    <Icon type="logout" />
                    &nbsp;&nbsp;登出
                </Button>
            </div>
        );
        return (
            <Header className="header" style={{ lineHeight: '64px', padding: 0 }}>
                <div className="header-logo">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={6}>
                            <Icon type="bulb" theme="twoTone" />
                        </Col>
                        <Col span={16}>茶会所</Col>
                    </Row>
                </div>
                <div className="header-body">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={12} push={12}>
                            <Popover content={content} trigger="hover" placement="bottomLeft">
                                <Avatar size={30}>头像</Avatar>
                            </Popover>
                        </Col>
                        <Col span={12} pull={12}>
                            <Badge count={50} title="您有50条消息未读">
                                <Icon type="bell" theme="filled" style={{ fontSize: "24px" }} onClick={this.handleClick} />
                            </Badge>
                        </Col>
                    </Row>
                </div>
            </Header>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        openDrawer: getMessageDrawerState(state)
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(uiActions, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminHeader);