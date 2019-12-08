import React from "react";
import { Modal, Button, Spin, Select, Row, Col, Typography } from "antd";
import { removePointById } from "../../../../../utils/commonUtils";

const { Option } = Select;

class AddClerkModal extends React.Component {
    constructor(props) {
        super(props);
    }

    handleOk = e => {
        this.props.handleOk();
    };

    handleCancel = e => {
        this.props.handleCancel();
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
            const { selectManagers, selectClerks } = this.props;
            const managers = removePointById(clerksWithoutShop, selectClerks);
            const clerk = removePointById(clerksWithoutShop, selectManagers);
            const clerksChildren = clerk.map((id) => (
                <Option key={id}>{byClerks[id].name}&nbsp;&nbsp;{byClerks[id].contact}</Option>
            ));
            const managersChildren = managers.map((id) => (
                <Option key={id}>{byClerks[id].name}&nbsp;&nbsp;{byClerks[id].contact}</Option>
            ));
            return {
                clerksChildren,
                managersChildren
            };
        } else {
            return {
                clerksChildren: null,
                managersChildren: null
            };
        }
    }

    handleClerksChange = (value) => {
        this.props.handleClerksChange(value);
    }

    handleManagersChange = (value) => {
        this.props.handleManagersChange(value);
    }

    render() {
        const { clerks, byClerks, requestQuantity, visible } = this.props;
        const { clerksChildren, managersChildren } = this.getChildren(clerks, byClerks);
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
                        : <div style={{ width: "500px", height: "200px" }} className="outer-container">
                            <div style={{ width: "100%", height: "100%" }} className="inner-container">
                                <Row>
                                    <Col span={12}>
                                        <Typography.Title level={4} style={{ margin: "10px 0" }}>添加店长</Typography.Title>
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder="请选择或输入职员名称"
                                            defaultValue={this.props.selectManagers}
                                            onChange={this.handleManagersChange}
                                        >
                                            {managersChildren}
                                        </Select>
                                        <Typography.Title level={4} style={{ margin: "10px 0" }}>添加服务员</Typography.Title>
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder="请选择或输入职员名称"
                                            defaultValue={this.props.selectClerks}
                                            onChange={this.handleClerksChange}
                                        >
                                            {clerksChildren}
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
                        </div>
                    }
                </Modal>
            </div>
        );
    }
}


export default AddClerkModal;