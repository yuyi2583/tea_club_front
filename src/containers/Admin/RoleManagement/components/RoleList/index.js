import React from "react";
import { Card } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as clerkActions, getByClerks, getClerks } from "../../../../../redux/modules/clerk";
import { actions as appActions, getRequestQuantity } from "../../../../../redux/modules/app";

const { Meta } = Card;

class RoleList extends React.Component {
    componentDidMount() {
        this.props.startRequest();
        this.props.fetchAllClerks();
    }
    render() {
        const { requestQuantity, clerks, byClerks } = this.props;
        return (
            <div>
                {
                    clerks && clerks.map((id) => (
                        <Card
                            hoverable
                            key={id}
                            style={{ width: 150,display:"inline-block",margin:"10px" }}
                            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                        >
                            <Meta title="Europe Street beat" description="www.instagram.com" />
                        </Card>
                    ))
                }
            </div>
        )
    }
}
const mapStateToProps = (state, props) => {
    return {
        byClerks: getByClerks(state),
        clerks: getClerks(state),
        requestQuantity: getRequestQuantity(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(clerkActions, dispatch),
        ...bindActionCreators(appActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleList);