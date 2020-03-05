import React from "react";
import { Form, Input, Icon, Button } from 'antd';
import ActivityRuleInput from "../components/ActivityRuleInput";

let id = 0;

class DynamicFieldSet extends React.Component {
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        console.log('Received values of form: ', values);
        console.log('Merged values:', keys.map(key => names[key]));
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      console.log("k",k);
      
      return(
      // <Form.Item
      //   {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
      //   label={index === 0 ? 'Passengers' : ''}
      //   required={true}
      //   key={k}
      // >
      //   {getFieldDecorator(`names[${k}]`, {
      //     validateTrigger: ['onChange', 'onBlur'],
      //     rules: [
      //       {
      //         required: true,
      //         whitespace: true,
      //         message: "Please input passenger's name or delete this field.",
      //       },
      //     ],
      //   })(<Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />)}
      <div key={k}>
        <React.Children {...this.props} index={k} />
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </div>
    )});
    return (
      <div>
        {formItems}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> Add field
          </Button>
        </Form.Item>
      </div>
    );
  }
}

export default DynamicFieldSet;