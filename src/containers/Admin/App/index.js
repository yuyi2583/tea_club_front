import React from "react";
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import "./style.css";
import SiderContent from "../../../components/SiderContent";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getClientHeight} from "../../../redux/modules/ui";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class App extends React.Component {

    onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };

    render() {
        return (
            <Layout>
                <Header className="header">
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{ lineHeight: '64px' }}>
                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <Layout>
                    <Sider id="admin-sider" width={256} style={{ background: '#fff',height:(this.props.clientHeight-64)+"px" }}>
                        <SiderContent/>
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
                            Content
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

const mapStateToProps=(state,props)=>{
    return {
        clientHeight:getClientHeight(state)
    }
}

const mapDispatchToProps=(dispatch)=>{
    return {
        ...bindActionCreators(dispatch)
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(App);