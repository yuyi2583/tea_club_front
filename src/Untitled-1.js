import { TreeSelect, Spin } from 'antd';
import React from "react";
import { requestType } from "./utils/common";

class Demo extends React.Component {
  state = {
    value: undefined,
    treeData: [
      { id: 1, pId: 0, value: '1', title: 'Expand to load' },
      { id: 2, pId: 0, value: '2', title: 'Expand to load' },
      { id: 3, pId: 2, value: '3', title: 'Tree Node', isLeaf: true },
    ],
  };

  genTreeNode = (parentId, isLeaf = false) => {
    const random = Math.random()
      .toString(36)
      .substring(2, 6);
    return {
      id: random,
      pId: parentId,
      value: random,
      title: isLeaf ? 'Tree Node' : 'Expand to load',
      isLeaf,
    };
  };

  onLoadData = treeNode =>
    new Promise(resolve => {
      const { id } = treeNode.props;
      this.props.fetchProductDetail(id).then(() => {
        resolve();
      });
    });

  onChange = value => {
    console.log("on change", value);
    this.setState({ value });
  };

  convertToStandardTreeData = ({ productType, byProductType, productDetail, byProductDetail }) => {
    let treeData = new Array();
    productType.forEach((uid) => {
      treeData.push({ id: uid, pId: -1, value: uid, title: byProductType[uid].type });
    });
    productDetail.forEach((uid) => {
      treeData.push({ id: uid, pId: byProductDetail[uid].type, value: uid, title: byProductDetail[uid].name, isLeaf: true });
    })
    return treeData;
  }

  render() {
    // const { treeData } = this.state;
    const treeData = this.convertToStandardTreeData(this.props);

    return (
      <TreeSelect
        onFocus={() => this.props.fetchProductType(requestType.modalRequest)}
        treeDataSimpleMode
        style={{ width: '200px' }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择优惠产品范围"
        treeCheckable={true}
        onChange={this.onChange}
        loadData={this.onLoadData}
        treeData={treeData}
      />
    );
  }
}

export default Demo;