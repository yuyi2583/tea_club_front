import React from "react";
import { Tag } from 'antd';
import "./style.css";

const { CheckableTag } = Tag;

class MyCheckableTag extends React.Component {
  state = { checked: false };

  handleChange = checked => {
    this.setState({ checked });
    this.props.onClick();
  };

  render() {
    return (
      <CheckableTag {...this.props} checked={this.state.checked} onChange={this.handleChange} />
    );
  }
}

export default MyCheckableTag;
