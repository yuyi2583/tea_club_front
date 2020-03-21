import React from "react";
import { Form, Select, TimePicker, Row, Col } from "antd";
import { DynamicFieldSetContext } from "../../components/DynamicFieldSet";
import PropTypes from "prop-types";
import moment from 'moment';

const { Option } = Select;
const format = "HH:mm"

class ShopOpenHour extends React.Component {

    componentDidMount() {
        // if (this.props.openHour != null) {
        //     const { getFieldDecorator, getFieldsValue } = this.props.form;
        //     getFieldDecorator('date_' + this.context, { initialValue: this.props.openHour.date });
        //     getFieldDecorator('startTime_' + this.context, { initialValue: moment(this.props.openHour.startTime) });
        //     getFieldDecorator('endTime_' + this.context, { initialValue: moment(this.props.openHour.endTime) });
        //     console.log("field value", getFieldsValue());
        // }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const index = this.context;
        let isUpdate=false;
        if (this.props.openHour != null){
            isUpdate=true
        }
        return (
            <Row type="flex" justify="center">
                <Col span={7}>
                    <Form.Item style={{ display: 'inline-block' }}>
                        {getFieldDecorator('startTime_' + index, {
                            rules: [{ required: true, message: '请选择开业时间!' }],
                            initialValue:isUpdate?moment(this.props.openHour.startTime,format):null
                        })(<TimePicker
                            format={format}
                            name={'startTime_' + index}
                            placeholder="选择开业时间" />
                        )}
                    </Form.Item>
                </Col>
                <Col span={1}>
                    <span style={{ display: 'inline-block' }}>&nbsp;-&nbsp;</span>
                </Col>
                <Col span={7}>
                    <Form.Item style={{ display: 'inline-block' }}>
                        {getFieldDecorator('endTime_' + index, {
                            rules: [{ required: true, message: '请选择打烊时间!' }],
                            initialValue: isUpdate?moment(this.props.openHour.endTime,format):null
                        })(<TimePicker
                            format={format}
                            name={'endTime_' + index}
                            placeholder="选择打烊时间" />
                        )}
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <span style={{ display: 'inline-block' }}>&nbsp;重复&nbsp;</span>
                </Col>
                <Col span={7}>
                    <Form.Item style={{ display: 'inline-block', width: "100px" }}>
                        {getFieldDecorator('date_' + index, {
                            rules: [{ required: true, message: '请选择重复日期!' }],
                            initialValue:isUpdate?this.props.openHour.date:new Array()
                        })(<Select mode="tags" tokenSeparators={[',']} name={'date_' + index}>
                            <Option key={1} value={1}>周一</Option>
                            <Option key={2} value={2}>周二</Option>
                            <Option key={3} value={3}>周三</Option>
                            <Option key={4} value={4}>周四</Option>
                            <Option key={5} value={5}>周五</Option>
                            <Option key={6} value={6}>周六</Option>
                            <Option key={7} value={7}>周日</Option>
                        </Select>
                        )}
                    </Form.Item>
                </Col>
            </Row>
        );
    }
}

ShopOpenHour.contextType = DynamicFieldSetContext;



ShopOpenHour.propTypes = {
    form: PropTypes.object.isRequired,
    openHour: PropTypes.object
}

ShopOpenHour.defaultProps = {
    openHour: null
}

export default ShopOpenHour;