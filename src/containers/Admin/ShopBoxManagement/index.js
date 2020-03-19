import React from "react";
import { Select, PageHeader, Tooltip, Icon, Button, message } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getByClerks } from "../../../redux/modules/clerk";
import { Route, Link } from "react-router-dom";
// import ClerkView from "./components/ClerkView";
// import BoxView from "./components/BoxView";
// import ShopList from "./components/ShopList";
import ShopBoxDetail from "./components/ShopBoxDetail";
import ShopBoxList from "./components/ShopBoxList";


class ShopBoxManagement extends React.Component {

    render() {
        const { byClerks, match, addButtonVisible, history, alterInfo } = this.props;
        const extra = this.props.getExtra();
        const subTitle = this.props.getSubTitle();
        return (
            <div>
                <PageHeader
                    title="包厢管理"
                    subTitle={subTitle}
                    onBack={this.props.handleBack}
                    extra={extra}>
                    <div>
                         <Route
                            path={match.url}
                            exact
                            render={props =>
                                <ShopBoxList
                                    {...this.props}
                                    {...props} />
                            } />
                       <Route
                            path={`${match.url}/shop_box/:shopBoxId`}
                            render={props =>
                                <ShopBoxDetail
                                    {...this.props}
                                    {...props} />
                            } />
                      
                        {/* <Route
                            path={`${match.url}/boxInfo/:shopId/:boxId`}
                            render={props =>
                                <BoxView
                                    {...props}
                                    {...this.props}
                                    // callMessage={this.callMessage}
                                    alterInfo={alterInfo} />
                            } />
                        
                        <Route
                            path={`${match.url}/clerkDetail/:shopId/:clerkId`}
                            render={(props) => (
                                <ClerkView
                                    {...props}
                                    {...this.props}
                                    byClerks={byClerks}
                                // callMessage={this.callMessage} 
                                />
                            )} /> */}
                    </div>
                </PageHeader>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        byClerks: getByClerks(state),
        // alterInfo: getAlterInfoState(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // ...bindActionCreators(uiActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopBoxManagement);