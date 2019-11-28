import React from "react";
import { Layout, Breadcrumb } from 'antd';
import "./style.css";
import SiderContent from "../../../components/SiderContent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getClientHeight } from "../../../redux/modules/ui";
import Header from "../../../components/AdminHeader";
import Drawer from "../../../components/MessageDrawer";
import Routers, { map } from "../../../router";
import { Route, Redirect, Switch } from "react-router-dom";
import { actions as authActions,getAuth,getAuthority } from "../../../redux/modules/adminAuth";

const { Content, Sider } = Layout;

class App extends React.Component {

    componentDidMount(){
        //调试用，避免每次热更新都要重新登录，生产环境需要删除
        this.props.login("123","1");
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: map.admin.AdminHome() } };
        const {authority}=this.props;
        return (
            <Layout>
                <Header location={this.props.location} />
                <Layout>
                    <Sider id="admin-sider" width={256} style={{ background: '#fff', height: (this.props.clientHeight - 64) + "px" }}>
                        <SiderContent />
                    </Sider>
                    <Layout
                        style={{
                            padding: '24px 24px',
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
                                                // this.props.auth.userId ? 
                                                true?
                                                <item.component {...props} /> :
                                                    <Redirect to={{
                                                        pathname: map.admin.AdminLogin(),
                                                        state: { from }
                                                    }} />
                                        )} />
                                    })}
                                    {authority.map((item)=>{
                                       return <Route key={item.id} path={item.pathname} exact render={(props) => (
                                        !item.auth ? <item.component {...props} authority={authority} /> :
                                            // this.props.auth.userId ? 
                                            true?
                                            <item.component {...props} authority={authority} /> :
                                                <Redirect to={{
                                                    pathname: map.admin.AdminLogin(),
                                                    state: { from }
                                                }} />
                                    )} />
                                    })}
                                    <Redirect to={{
                                        pathname:map.error(),
                                        state:{from}
                                    }}/>
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
        auth: getAuth(state),
        authority:getAuthority(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(authActions,dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);