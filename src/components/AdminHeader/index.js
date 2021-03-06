import React from "react";
import { Layout, Icon, Row, Col, Avatar, Badge, Popover, Button, Divider } from 'antd';
import "./style.css";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as uiActions, getMessageDrawerState } from "../../redux/modules/ui";
import { Link } from "react-router-dom";
import { map } from "../../router";
import { actions as authActions, getUser } from "../../redux/modules/adminAuth";
import Brand from "../../assets/brand.svg";

const { Header } = Layout;

class AdminHeader extends React.Component {

    handleClick = () => {
        this.props.openMessageDrawer();
    }

    render() {
        const { user } = this.props;
        const { from } = this.props.location.state || { from: { pathname: map.admin.AdminHome() } };
        const content = (
            <div style={{ width: "150px" }}>
                <Button type="link" block className="avatar-content">
                    <Row gutter={8}>
                        <Col span={8}><Icon type="user" /></Col>
                        <Col span={16}>
                            {user.name}
                        </Col>
                    </Row>
                </Button>
                <Divider style={{ margin: "5px 0" }} />
                <Button type="link" block className="avatar-content">
                    <Row gutter={8}>
                        <Col span={8}><Icon type="setting" /></Col>
                        <Col span={16}>
                            <Link
                                to={{
                                    pathname: map.admin.AdminAlterPsw(),
                                    state: { from }
                                }}
                                style={{ color: "#808080" }}
                            >
                                修改密码
                            </Link>
                        </Col>
                    </Row>
                </Button>
                <Button type="link" block className="avatar-content">
                    <Row gutter={8}>
                        <Col span={8}><Icon type="logout" /></Col>
                        <Col span={16} style={{ color: "#808080" }}>
                            登出
                        </Col>
                    </Row>
                </Button>
            </div>
        );
        return (
            <Header className="header" style={{ lineHeight: '64px', padding: 0 }}>
                <div className="header-logo">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={6}>
                            <Icon type="bulb" />
                        </Col>
                        <Col span={16}>茶会所</Col>
                    </Row>
                </div>
                <div className="header-body">
                    {/* <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={12} push={12}> */}
                    <Popover content={content} trigger="hover" placement="bottomLeft">
                        <Avatar size={40} src={`data:image/png;base64,${user.avatar==undefined?undefined:user.avatar.photo}`}>头像</Avatar>
                    </Popover>
                    {/* </Col>
                    </Row> */}
                </div>
            </Header>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        openDrawer: getMessageDrawerState(state),
        user: getUser(state)
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators({ ...uiActions, ...authActions }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminHeader);