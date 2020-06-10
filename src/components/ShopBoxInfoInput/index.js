import React from "react";
import { Form, Input, Row, Col } from "antd";
import { DynamicFieldSetContext } from "../DynamicFieldSet";

class ShopBoxInfoInput extends React.Component {

    render() {

        const { getFieldDecorator } = this.props.form;
        const index = this.context;
        let isUpdate = false;
        if (this.props.info != null) {
            isUpdate = true;
        }
        return (
            <Row type="flex">
                <Col span={7}>
                    <Form.Item style={{ display: 'inline-block' }}>
                        {getFieldDecorator('title_' + index, {
                            rules: [{ required: true, message: '请输入须知标题!' }],
                            initialValue: isUpdate ? this.props.info.title : null
                        })(<Input placeholder="请输入须知标题" /> )}
                    </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={7}>
                    <Form.Item style={{ display: 'inline-block' }}>
                        {getFieldDecorator('info_' + index, {
                            rules: [{ required: true, message: '请输入须知内容!' }],
                            initialValue: isUpdate ? this.props.info.info : null
                        })(<Input placeholder="请输入须知内容" />)}
                    </Form.Item>
                </Col>
            </Row>
        )
    }
}


ShopBoxInfoInput.contextType = DynamicFieldSetContext;

export default ShopBoxInfoInput;