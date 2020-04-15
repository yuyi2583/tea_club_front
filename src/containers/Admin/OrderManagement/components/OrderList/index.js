import React from "react";
import { actions as orderActions, getByOrders, getOrders, getByOrderActivityRules, getByOrderClerks, getByOrderCustomers, getByProducts } from "../../../../../redux/modules/order";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchTimeRange } from "../../../../../utils/common";
import { Button, Icon, Input, Spin, Tooltip, Table, Modal, DatePicker, Typography, Row, Col, Select } from "antd";
import { map } from "../../../../../router";
import { Link } from "react-router-dom";
import Highlighter from 'react-highlight-words';
import { timeStampConvertToFormatTime, getNDaysAgoTimeStamp } from "../../../../../utils/timeUtil";
import { orderStatus, fetchOrderStatus } from "../../../../../utils/common";
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
const format = "YYYY-MM-DD";

class OrderList extends React.Component {

    state = {
        searchText: '',
        searchedColumn: '',
        selectedRows: new Array(),
        status: undefined,
        startDate: undefined,
        endDate: undefined,
    };

    componentDidMount() {
        this.props.fetchUncompleteOrders().catch(err => this.props.callMessage("error", err));
    }

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
        orders.length > 0 && orders.forEach((uid) => {
            try {
                const dataItem = {
                    key: uid,
                    ...byOrders[uid],
                    products: byOrders[uid].products.map(uid => (
                        <Row key={uid}>
                            <Col span={8}>{byProducts[uid].product.name}</Col>
                            <Col span={8} offset={4}>x{byProducts[uid].number}</Col>
                        </Row>)),
                    customerId: byOrders[uid].customer,
                    status: orderStatus[byOrders[uid].status.status],
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
            },
            {
                title: '提单时间',
                dataIndex: 'orderTime',
                key: 'orderTime',
            },
            {
                title: '提单人（账号ID）',
                dataIndex: 'customerId',
                key: 'customerId',
                ...this.getColumnSearchProps('customerId'),
            },
            {
                title: '总价',
                dataIndex: 'amount',
                key: 'amount',
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: "操作",
                dataIndex: "action",
                key: "action",
                render: (text, record) => (
                    <span>
                        <Tooltip title={`编辑此订单`}>
                            <Link to={`${map.admin.AdminHome()}/order_management/orders/order/${record.uid}`}>编辑</Link>
                        </Tooltip>
                    </span>
                ),
            }
        ];
    }

    disabledDate = (current) => {
        return current > moment().endOf('day');
    }



    timeRangeChange = (value) => {
        const startDate = new Date(value[0].format()).getTime();
        const endDate = new Date(value[1].format()).getTime();
        this.setState({ startDate, endDate });
    }

    selectRange = (dates) => {
        const { startDate, endDate } = this.state;
        let { status } = this.state;
        if (status == undefined) {
            status = "all";
        }
        this.props.fetchOrders(status, { startDate, endDate });
    }


    fetchAllOrders = () => {
        this.setState({ status: undefined, startDate: null, endDate: null });
        this.props.fetchOrders(fetchOrderStatus.all, fetchTimeRange["all"]())
            .catch(err => this.props.callMessage("error", err));
    }

    handleSelectChange = (value) => {
        console.log("select", value);
        this.setState({ status: value });
        let { startDate, endDate } = this.state;
        if (startDate == undefined) {
            startDate = -1;
        }
        if (endDate == undefined) {
            endDate = getNDaysAgoTimeStamp(-1);
        }
        this.props.fetchOrders(value, { startDate, endDate });
    }

    getDurationValue = () => {
        const { startDate, endDate } = this.state;
        let duration = new Array();
        if (startDate == undefined && endDate == undefined) {
            return duration;
        }
        duration.push(moment(timeStampConvertToFormatTime(startDate), format));
        duration.push(moment(timeStampConvertToFormatTime(endDate), format));
        return duration;
    }

    render() {
        const { retrieveRequestQuantity } = this.props;
        const data = this.getDataSource();
        const columns = this.getColmuns();
        const { status, startDate, endDate } = this.state;
        return (
            <div>
                <Spin spinning={retrieveRequestQuantity > 0}>
                    <span>当前默认显示所有未完成订单</span>
                    <Button type="link" onClick={this.fetchAllOrders}>加载所有订单数据</Button>
                    <div>
                        <Select placeholder="请选择订单类型" onChange={this.handleSelectChange} style={{ width: 200 }} value={status}>
                            <Option value="all">所有</Option>
                            <Option value="payed">买家已付款</Option>
                            <Option value="shipped">卖家已发货</Option>
                            <Option value="refunded">卖家已退款</Option>
                            <Option value="requestRefund">买家申请退款</Option>
                            <Option value="complete">完成</Option>
                        </Select>
                        &nbsp;&nbsp;
                        <RangePicker showTime format={format} disabledDate={this.disabledDate} onChange={this.timeRangeChange} onOk={this.selectRange} value={this.getDurationValue()} />
                    </div>
                    <Table
                        columns={columns}
                        dataSource={data} />
                </Spin>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        orders: getOrders(state),
        byOrders: getByOrders(state),
        byOrderActivityRules: getByOrderActivityRules(state),
        byOrderClerks: getByOrderClerks(state),
        byOrderCustomers: getByOrderCustomers(state),
        byProducts: getByProducts(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(orderActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderList);