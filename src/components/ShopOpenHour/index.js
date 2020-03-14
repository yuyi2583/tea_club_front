import React from "react";
import { Form, Select, TimePicker, Row, Col } from "antd";
import { DynamicFieldSetContext } from "../../components/DynamicFieldSet";

const { Option } = Select;
const format = "HH:mm"

class ShopOpenHour extends React.Component {

    render() {
        const { getFieldDecorator } = this.props.form;
        const index = this.context;
        return (
            <Row type="flex" justify="start">
                <Col span={7}>
                    <Form.Item style={{ display: 'inline-block' }}>
                        {getFieldDecorator('startTime_' + index, {
                            rules: [{ required: true, message: '请选择开业时间!' }],
                        })(<TimePicker
                            format={format}
                            placeholder="选择开业时间" />
                        )}
                    </Form.Item>
                </Col>
                <span style={{ display: 'inline-block' }}>&nbsp;-&nbsp;</span>
                <Col span={7}>
                    <Form.Item style={{ display: 'inline-block' }}>
                        {getFieldDecorator('endTime_' + index, {
                            rules: [{ required: true, message: '请选择打烊时间!' }],
                        })(<TimePicker
                            format={format}
                            placeholder="选择打烊时间" />
                        )}
                    </Form.Item>
                </Col>
                <span style={{ display: 'inline-block' }}>&nbsp;重复&nbsp;</span>
                <Col span={7}>
                    <Form.Item style={{ display: 'inline-block', width: "100px" }}>
                        {getFieldDecorator('repeat_' + index, {
                            rules: [{ required: true, message: '请选择重复日期!' }],
                        })(<Select mode="tags" tokenSeparators={[',']}>
                            <Option key={1}>周一</Option>
                            <Option key={2}>周二</Option>
                            <Option key={3}>周三</Option>
                            <Option key={4}>周四</Option>
                            <Option key={5}>周五</Option>
                            <Option key={6}>周六</Option>
                            <Option key={7}>周日</Option>
                        </Select>
                        )}
                    </Form.Item>
                </Col>
            </Row>
        );
    }
}

ShopOpenHour.contextType = DynamicFieldSetContext;

export default ShopOpenHour;