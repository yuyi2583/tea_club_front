import React from 'react';
import { Button, Icon, Input, Spin, Tooltip, Table, DatePicker, Row, Col } from "antd";
import { map } from "../../../../../../../router";
import { Link } from "react-router-dom";
import Highlighter from 'react-highlight-words';
import PropTypes from "prop-types";
import { timeStampConvertToFormatTime } from "../../../../../../../utils/timeUtil";
import { orderStatus } from "../../../../../../../utils/common";
import moment from 'moment';

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

  getAmountDispaly = (order) => {
    let display = "";
    if (order.amount.ingot != 0) {
      display += order.amount.ingot + "元宝 ";
    }
    if (order.amount.credit != 0) {
      display += order.amount.credit + "积分";
    }
    return display;
  }

  getDataSource = () => {
    const { orders, byOrders, byProducts } = this.props;
    let dataSource = new Array();
    orders.forEach((uid) => {
      try {
        const dataItem = {
          key: uid,
          ...byOrders[uid],
          products: byOrders[uid].products.map(uid => (
            <Row key={uid}>
              <Col span={8}>{byProducts[uid].product.name}</Col>
              <Col span={8} offset={4}>x{byProducts[uid].number}</Col>
            </Row>)),
          customerId: byOrders[uid].customer.uid,
          status: orderStatus[byOrders[uid].status],
          amount: this.getAmountDispaly(byOrders[uid]),
          orderTime: timeStampConvertToFormatTime(byOrders[uid].orderTime)
        };
        dataSource.push(dataItem);
      } catch (err) {
      };

    })
    return dataSource;
  }

  getColmuns = () => {
    return [
      {
        title: '订单编号',
        dataIndex: 'uid',
        key: 'uid',
        ...this.getColumnSearchProps('uid'),
      },
      {
        title: '产品',
        dataIndex: 'products',
        key: 'products',
        width: "20%",
        ...this.getColumnSearchProps('productName'),
      },
      {
        title: '提单时间',
        dataIndex: 'orderTime',
        key: 'orderTime',
        ...this.getColumnSearchProps('orderTime'),
      },
      {
        title: '总价',
        dataIndex: 'amount',
        key: 'amount',
        ...this.getColumnSearchProps('amount'),
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
            <Tooltip title={`编辑订单`}>
              <Link to={`${map.admin.AdminHome()}/order_management/orders/order/${record.uid}`}>编辑</Link>
            </Tooltip>
          </span>
        ),
      }
    ];
  }

  disabledDate = (current) => {
    // Can not select days before today and today
    return current > moment().endOf('day');
  }

  selectRange = (dates) => {
    const startDate = new Date(dates[0].format()).getTime();
    const endDate = new Date(dates[1].format()).getTime();
    console.log("time range select", { startDate, endDate });

    this.props.fetchOrdersTimeRange({ startDate, endDate });
  }

  render() {
    const { retrieveRequestQuantity } = this.props;
    const data = this.getDataSource();
    const columns = this.getColmuns();
    return (
      <div>
        <Spin spinning={retrieveRequestQuantity > 0}>
          <div>
            <RangePicker showTime format="YYYY-MM-DD" disabledDate={this.disabledDate} onOk={this.selectRange} />
          </div>
          <Table
            columns={columns}
            dataSource={data} />
        </Spin>
      </div>
    )
  }
}

OrderList.propTypes = {
  orders: PropTypes.array.isRequired,
  byOrders: PropTypes.object.isRequired,
  byOrderActivityRules: PropTypes.object.isRequired,
  byOrderClerks: PropTypes.object.isRequired,
  byProducts: PropTypes.object.isRequired,
}

export default OrderList;