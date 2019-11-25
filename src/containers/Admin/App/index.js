import React from "react";
import { Layout, Menu, Breadcrumb, Icon, Row, Col, Avatar } from 'antd';
import "./style.css";
import SiderContent from "../../../components/SiderContent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getClientHeight } from "../../../redux/modules/ui";
import Header from "../../../components/AdminHeader";
import Drawer from "../../../components/MessageDrawer";
import Routers, { map, NotFound } from "../../../router";
import {Route,Redirect} from"react-router-dom";
import {getAuth} from "../../../redux/modules/auth";

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

class App extends React.Component {

    // onOpenChange = openKeys => {
    //     const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    //     if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    //         this.setState({ openKeys });
    //     } else {
    //         this.setState({
    //             openKeys: latestOpenKey ? [latestOpenKey] : [],
    //         });
    //     }
    // };

    render() {
        const { from } = this.props.location.state || { from: { pathname:map.admin.AdminHome()  } };
        return (
            <Layout>
                <Header location={this.props.location} />
                <Layout>
                    <Sider id="admin-sider" width={256} style={{ background: '#fff', height: (this.props.clientHeight - 64) + "px" }}>
                        <SiderContent />
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb>
                        <Content
                            style={{
                                background: '#fff',
                                padding: 24,
                                margin: 0,
                                height: 578 - 24 - 32 - 21 - 64,
                            }}>
                            {Routers.admin.map((item, index) => {
                                return <Route key={index} path={item.path} exact render={(props) => (
                                    !item.auth ? <item.component {...props} /> : 
                                    this.props.auth.userId ? <item.component {...props} /> :
                                    <Redirect to={{
                                        pathname: map.admin.AdminLogin(),
                                        state: { from }
                                    }} /> 
                                )} />
                            })}
                            {/* <Route component={NotFound} /> */}
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
        auth:getAuth(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);