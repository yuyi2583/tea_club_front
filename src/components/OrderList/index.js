import React from 'react';
import { Button, Icon, Divider, Input, Spin, Tooltip, Table, Modal, DatePicker } from "antd";
import { map } from "../../router";
import { Link } from "react-router-dom";
import Highlighter from 'react-highlight-words';
import PropTypes from "prop-types";
import { timeStampConvertToFormatTime, momentConvertToTimeStamp } from "../../utils/timeUtil";
import { orderStatus } from "../../utils/common";
import moment from 'moment';

const { confirm } = Modal;
const { RangePicker } = DatePicker;

class OrderList extends React.Component {

  state = {
    searchText: '',
    searchedColumn: '',
    selectedRows: new Array()
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
          status: orderStatus[byOrders[uid].status],
          orderTime: timeStampConvertToFormatTime(byOrders[uid].orderTime)
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
    const thiz = this;
    confirm({
      title: '确认删除?',
      content: '确认删除此订单记录？',
      onCancel() {
      },
      onOk() {
        thiz.props.deleteOrder(uid)
          .then(() => {
            thiz.props.callMessage("success", "删除订单成功！");
          })
          .catch(err => {
            thiz.props.callMessage("error", "删除订单失败！" + err);
          });
      },
    });
  }

  // rowSelection object indicates the need for row selection
  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      this.setState({ selectedRows });
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  deleteOrdersByBatch = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length == 0) {
      Modal.error({
        title: '错误',
        content: '请选择至少一行订单记录！',
      });
      return;
    }
    const thiz = this;
    confirm({
      title: '确认删除?',
      content: '确认删除这些订单记录？',
      onCancel() {
      },
      onOk() {
        thiz.props.deleteOrdersByBatch(selectedRows)
          .then(() => {
            thiz.props.callMessage("success", "删除订单成功！");
          })
          .catch(err => {
            thiz.props.callMessage("error", "删除订单失败！" + err);
          });
      },
    });

  }

  disabledDate = (current) => {
    // Can not select days before today and today
    return current > moment().endOf('day');
  }

  selectRange = (dates) => {
    const starDate = new Date(dates[0].format()).getTime();
    const endDate = new Date(dates[1].format()).getTime();
    this.props.fetchOrdersTimeRange({ starDate, endDate });
  }

  render() {
    const { requestQuantity } = this.props;
    const data = this.getDataSource();
    const columns = this.getColmuns();
    return (
      <div>
        <Spin spinning={requestQuantity > 0}>
          <div>
            <Button type="primary" onClick={this.deleteOrdersByBatch}>批量删除</Button>&nbsp;&nbsp;
            <RangePicker showTime format="YYYY-MM-DD" disabledDate={this.disabledDate} onOk={this.selectRange} />
          </div>
          <Table
            columns={columns}
            rowSelection={this.rowSelection}
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