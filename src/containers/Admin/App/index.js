import React from "react";
import { Layout } from 'antd';
import "./style.css";
import SiderContent from "../../../components/SiderContent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getClientHeight } from "../../../redux/modules/ui";
import Header from "../../../components/AdminHeader";
import Drawer from "../../../components/MessageDrawer";
import Routers, { map } from "../../../router";
import { Route, Redirect, Switch } from "react-router-dom";
import { actions as authActions, getUser, getByAuthorities, getByAuthorityBelong } from "../../../redux/modules/adminAuth";

const { Content, Sider } = Layout;

class App extends React.Component {
    state = {
        isVerifying: true
    }

    componentDidMount() {
        //页面刷新后发送请求给后端验证是否已经登陆，未登录则跳转会登陆界面
        this.props.verifyLogin()
            .then(() => {
                this.setState({ isVerifying: false });
            })
            .catch((err) => {
                this.props.callMessage("error", err);
                this.setState({ isVerifying: false });
            });
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: map.admin.AdminHome() } };
        const { user, byAuthorities } = this.props;
        const { isVerifying } = this.state;
        return (
            <Layout>
                <Header location={this.props.location} />
                <Layout>
                    <Sider id="admin-sider" width={256} style={{ background: '#fff', height: (this.props.clientHeight - 64) + "px" }}>
                        <SiderContent />
                    </Sider>
                    <Layout
                        style={{
                            padding: '24px',
                            height: (this.props.clientHeight - 64) + "px",
                        }}>
                        <Content
                            style={{
                                background: '#fff',
                                padding: 24,
                                margin: 0,
                                position: "relative",
                                overflow: "hidden",
                            }}>
                            <div style={{
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                right: "-17px",
                                overflowX: "hidden",
                                overflowY: "scroll"
                            }}>
                                <Switch>
                                    {Routers.admin.map((item, index) => {
                                        return <Route key={index} path={item.path} exact render={(props) => (
                                            !item.auth ? <item.component {...props} /> :
                                                user.name != undefined ?
                                                    <item.component {...props} /> :
                                                    isVerifying ? <item.component {...props} /> :
                                                        <Redirect to={{
                                                            pathname: map.admin.AdminLogin(),
                                                            state: { from }
                                                        }} />
                                        )} />
                                    })}
                                    {user.authorities != undefined && user.authorities.map((uid) => {
                                        return <Route key={uid} path={byAuthorities[uid].pathname} render={(props) => {
                                            const item = byAuthorities[uid];
                                            return (
                                                !byAuthorities[uid].auth ? <item.component {...props} authority={byAuthorities} /> :
                                                    user.name != undefined ?
                                                        <item.component {...props} authority={byAuthorities} /> :
                                                        isVerifying ? <item.component {...props} /> :
                                                            <Redirect to={{
                                                                pathname: map.admin.AdminLogin(),
                                                                state: { from }
                                                            }} />
                                            )
                                        }} />
                                    })}
                                    <Redirect to={{
                                        pathname: map.error(),
                                        state: { from }
                                    }} />
                                </Switch>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
                <Drawer />
            </Layout>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        clientHeight: getClientHeight(state),
        user: getUser(state),
        byAuthorities: getByAuthorities(state),
        byAuthorityBelong: getByAuthorityBelong(state),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(authActions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);