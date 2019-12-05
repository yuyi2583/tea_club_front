import React from "react";
import { Modal, Button, Spin, Select, Row, Col, Typography } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as clerkActions, getPlainClerks, getClerks } from "../../../../../../../redux/modules/clerk";
import { actions as appActions, getModalRequestQuantity } from "../../../../../../../redux/modules/app";
import { actions as uiActions } from "../../../../../../../redux/modules/ui";

const { Option } = Select;

class AddClerkModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectClerks: []
        }
    }

    handleOk = e => {
        const { selectClerks } = this.state;
        this.props.handleOk(selectClerks);
        console.log("ok")
    };

    handleCancel = e => {
        this.props.handleCancel();
        this.setState({ selectClerks: [] });
    };

    getChildren = (clerks, byClerks) => {
        if (clerks) {
            const clerksWithoutShop = clerks.filter((item) => {
                if (!byClerks[item].shopId) {
                    return true;
                } else {
                    return false;
                }
            });
            const children = clerksWithoutShop.map((id) => (
                <Option key={id}>{byClerks[id].name}&nbsp;&nbsp;{byClerks[id].contact}</Option>
            ));
            return children;
        } else {
            return null;
        }
    }


    handleChange = (value) => {
        console.log(`selected ${value}`);
        this.setState({ selectClerks: value });
    }

    render() {
        const { clerks, byClerks, requestQuantity, visible } = this.props;
        const children = this.getChildren(clerks, byClerks);
        return (
            <div>
                <Modal
                    title="添加职员"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    {requestQuantity > 0 ?
                        <Spin size="large" />
                        : <div style={{ width: "500px", height: "200px" }}>
                            <Row>
                                <Col span={12}>
                                    <Typography.Title level={4} style={{ margin: "10px 0" }}>添加店长</Typography.Title>
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="请选择或输入职员名称"
                                        onChange={this.handleChange}
                                    >
                                        {children}
                                    </Select>
                                    <Typography.Title level={4} style={{ margin: "10px 0" }}>添加服务员</Typography.Title>
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="请选择或输入职员名称"
                                        onChange={this.handleChange}
                                    >
                                        {children}
                                    </Select>
                                </Col>
                                <Col span={6} push={4}>
                                    <Button type="primary">创建职员</Button>
                                    <div style={{ marginTop: "10px" }}>
                                        <Typography.Text strong>若无可选员工则可创建新的职员角色</Typography.Text>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    }
                </Modal>
            </div>
        );
    }
}


export default AddClerkModal;