import React from 'react';
import { Button, Icon, Divider, Input, Spin, Tooltip, Table } from "antd";
import { map } from "../../router";
import { Link } from "react-router-dom";
import Highlighter from 'react-highlight-words';
import PropTypes from "prop-types";

class OrderList extends React.Component {

  state = {
    searchText: '',
    searchedColumn: '',
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          重置
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  getDataSource = () => {
    const { orders, byOrders } = this.props;
    let dataSource = new Array();
    orders.length > 0 && orders.forEach((uid) => {
      try {
        const dataItem = {
          key: uid,
          ...byOrders[uid],
          productName: byOrders[uid].product.name,
          customerId: byOrders[uid].customer.uid,
          status: byOrders[uid].status,
        };
        dataSource.push(dataItem);
      } catch (err) {
        // console.error(err);
      };

    })
    return dataSource;
  }

  getColmuns = () => {
    // const { match } = this.props;
    return [
      {
        title: '订单编号',
        dataIndex: 'uid',
        key: 'uid',
        ...this.getColumnSearchProps('uid'),
      },
      {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName',
        ...this.getColumnSearchProps('productName'),
      },
      {
        title: '数量',
        dataIndex: 'number',
        key: 'number',
        ...this.getColumnSearchProps('number'),
      },
      {
        title: '提单时间',
        dataIndex: 'orderTime',
        key: 'orderTime',
        ...this.getColumnSearchProps('orderTime'),
      },
      {
        title: '提单人（账号ID）',
        dataIndex: 'customerId',
        key: 'customerId',
        ...this.getColumnSearchProps('customerId'),
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        ...this.getColumnSearchProps('status'),
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        render: (text, record) => (
          <span>
            <Tooltip title={`查看订单详情`}>
              <Link to={`${map.admin.AdminHome()}/order_management/orders/order/${record.uid}`}>详情</Link>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title={`删除此订单`}>
              <Button type="link" onClick={() => this.deleteOrder(record.uid)}>删除</Button>
            </Tooltip>
          </span>
        ),
      }
    ];
  }

  deleteOrder = (uid) => {

  }

  render() {
    const { requestQuantity } = this.props;
    const data = this.getDataSource();
    const columns = this.getColmuns();
    return (
      <div>
        <Spin spinning={requestQuantity > 0}>
          <Table
            columns={columns}
            loading={requestQuantity > 0}
            dataSource={data} />
        </Spin>
      </div>
    )
  }
}

OrderList.propTypes = {
  orders: PropTypes.array.isRequired,
  byOrders: PropTypes.object.isRequired,
}

export default OrderList;