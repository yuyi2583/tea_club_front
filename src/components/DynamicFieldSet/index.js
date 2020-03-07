import React from "react";
import { Form, Icon, Button, Row, Col } from 'antd';
import PropTypes from "prop-types";

let id = 0;
let initialValue = new Array();

export const DynamicFieldSetContext = React.createContext(-1);


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
    const key = form.getFieldValue('keys');
    console.log("remove keys", key);
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    console.log("keys", keys);
    const nextKeys = keys.concat(id++);
    console.log("add keys", nextKeys);

    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
    console.log("field value", form.getFieldValue("keys"));
  };

  initialKeys = () => {
    const children = this.props.children;
    const { getFieldDecorator } = this.props.form;
    if (id == 0) {
      if (children != undefined) {
        React.Children.forEach(children, (child, index) => {
          initialValue.push(id++);
        });
      } else {
        initialValue.push(id++);
      }
    }
    getFieldDecorator('keys', { initialValue });
  }

  getFormItems = () => {
    const { getFieldValue } = this.props.form;
    const { template } = this.props;
    const keys = getFieldValue('keys');
    console.log("keys in render", keys);
    const children = this.props.children;
    console.log("children", children);
    let items;
    if (children == undefined) {//没有子元素，需要使用模板
      items = keys.map((k) => {
        return (
          <Row key={k}>
            <Col span={20}>
              <DynamicFieldSetContext.Provider value={k}>
                {template}
              </DynamicFieldSetContext.Provider>
            </Col>
            {keys.length > 1 ? (
              <Col span={4}>
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.remove(k)}
                />
              </Col>) : null}
          </Row>
        )
      });
    } else {
      items = keys.map((k, index) => {
        if (k < children.length || children.length == undefined) {
          return (
            <Row key={k}>
              <Col span={20}>
                <DynamicFieldSetContext.Provider value={k}>
                  {children.length == undefined ? children : children[k]}
                </DynamicFieldSetContext.Provider>
              </Col>
              {keys.length > 1 ? (
                <Col span={4}>
                  <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={() => this.remove(k)}
                  />
                </Col>) : null}
            </Row>
          )
        } else {
          return (
            <Row key={k}>
              <Col span={20}>
                <DynamicFieldSetContext.Provider value={k}>
                  {template}
                </DynamicFieldSetContext.Provider>
              </Col>
              {keys.length > 1 ? (
                <Col span={4}>
                  <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={() => this.remove(k)}
                  />
                </Col>) : null}
            </Row>
          )
        }
      })
    }
    return items;
  }

  render() {
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    this.initialKeys();
    const formItems = this.getFormItems();
    return (
      <div>
        {formItems}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> {this.props.content}
          </Button>
        </Form.Item>
      </div>
    );
  }
}

DynamicFieldSet.propTypes = {
  template: PropTypes.element.isRequired,
  form: PropTypes.object.isRequired,
}

export default DynamicFieldSet;