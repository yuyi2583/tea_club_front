import React from "react";
import { Menu, Icon } from 'antd';
import "./style.css";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getByAuthorities, getByAuthorityBelong, getUser,getAuthorityBelong } from "../../redux/modules/adminAuth";
import { Link } from "react-router-dom";
import { map } from "../../router";
import { actions as uiActions } from "../../redux/modules/ui";

const { SubMenu } = Menu;

class SiderContent extends React.Component {
  constructor(props) {
    super(props);
    this.rootSubmenuKeys = [];
    this.state = {
      openKeys: ["0"],
    };
  }

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

  componentDidMount() {
    const { authorityBelong } = this.props;
    authorityBelong.forEach((item) => {
      this.rootSubmenuKeys.push(item.uid);
    })
    // this.setState({openKeys:authorityBelong[0].id});
    // console.log(authorityBelong[0]);
    //获取侧边栏内容
    // let {userId,authority}=this.props.auth;
    // this.props.fetchSiderContent(user)
  }

  handleClick = () => {
    this.props.selectShop_shopManagement("请选择门店");
    this.props.finishAlterInfo();
  }

  render() {
    const { user,byAauthorities,byAuthorityBelong ,authorityBelong} = this.props;
    return (
      <div id="siderContent-outer-container">
        <Menu
          mode="inline"
          id="siderContent-inner-container"
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
          style={{ borderRight: 0 }}
        >
          {
            authorityBelong.map((belong, index) => {
              return (
                <SubMenu
                  key={index}
                  title={
                    <span>
                      <Icon type={byAuthorityBelong[belong].icon} />
                      <span>{byAuthorityBelong[belong].title}</span>
                    </span>
                  }>
                  {user.authorities.filter((uid) => byAauthorities[uid].belong === belong).map((uid) => {
                    return (
                      <Menu.Item key={uid} onClick={this.handleClick}>
                        <Link to={{
                          pathname: byAauthorities[uid].pathname,
                        }}>{byAauthorities[uid].title}</Link>
                      </Menu.Item>
                    )
                  })}
                </SubMenu>
              )
            })
          }
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    byAuthorityBelong: getByAuthorityBelong(state),
    byAauthorities: getByAuthorities(state),
    user: getUser(state),
    authorityBelong:getAuthorityBelong(state),
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(uiActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SiderContent);