import React from "react";
import { Drawer, Card } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as uiActions, getMessageDrawerState } from "../../redux/modules/ui";

class MessageDrawer extends React.Component {

    onClose = () => {
        this.props.closeMessageDrawer();
    };

    render() {
        return (
            <div>
                <Drawer
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    width={350}
                    visible={this.props.openDrawer}
                >
                    <Card title="Default size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
                        <p>Card content</p>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>
                </Drawer>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageDrawer);