import React from "react";
import { Button, Icon, Divider, DatePicker, Input, Select, Spin, TreeSelect, Modal, Tooltip, Table, InputNumber } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as customerActions, getCustomers, getByCustomers } from "../../../../../redux/modules/customer";
import Highlighter from 'react-highlight-words';
import { Link } from "react-router-dom";
import { sex } from "../../../../../utils/common";

const { confirm } = Modal;

class CustomerList extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
    };

    componentDidMount() {
        this.props.fetchCustomers().catch(err => this.props.callMessage("error", err));
        // this.props.fetchCustomerType();
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

    getDataSource = () => {
        const { customers, byCustomers } = this.props;
        let dataSource = new Array();
        try{
            customers.forEach((uid) => {
                try {
                    const dataItem = {
                        key: uid,
                        ...byCustomers[uid],
                        customerType: byCustomers[uid].customerType.name,
                        sex: sex[byCustomers[uid].gender],
                    };
                    dataSource.push(dataItem);
                } catch (err) {
                    // console.error(err);
                };
    
            })

        }catch(err){
            console.log(err)
        }
        return dataSource;
    }

    getColmuns = () => {
        const { match } = this.props;
        return [
            {
                title: '用户编号',
                dataIndex: 'uid',
                key: 'uid',
                ...this.getColumnSearchProps('uid'),
            },
            {
                title: '用户名称',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                ...this.getColumnSearchProps('sex'),
            },
            {
                title: '联系方式',
                dataIndex: 'contact',
                key: 'contact',
                ...this.getColumnSearchProps('contact'),
            },
            {
                title: '客户类型',
                dataIndex: 'customerType',
                key: 'customerType',
                ...this.getColumnSearchProps('customerType'),
            },
            {
                title: "操作",
                dataIndex: "action",
                key: "action",
                render: (text, record) => (
                    <span>
                        <Tooltip title={`查看${record.name}信息及订单记录`}>
                            <Link to={`${match.url}/customer/${record.uid}`}>查看</Link>
                        </Tooltip>
                        {record.customerType == "超级vip用户" ? null :
                            <span>
                                <Divider type="vertical" />
                                <Tooltip title={`将${record.name}升级为超级VIP用户`}>
                                    <Button type="link" onClick={() => this.setSuperVIP(record.uid)}>设置超级VIP</Button>
                                </Tooltip>
                            </span>
                        }
                    </span>
                ),
            }
        ];
    }

    setSuperVIP = (uid) => {
        const { byCustomers } = this.props;
        const thiz = this;
        confirm({
            title: '确认升级?',
            content: `确认将${byCustomers[uid].name}升级为超级VIP？`,
            onCancel() {
            },
            onOk() {
                thiz.props.setSuperVIP(uid)
                    .then(() => {
                        thiz.props.callMessage("success", `${byCustomers[uid].name}升级超级VIP成功！`);
                    })
                    .catch(err => {
                        thiz.props.callMessage("error", `${byCustomers[uid].name}升级超级VIP失败` + err);
                    })
            },
        });

    }

    render() {
        const data = this.getDataSource();
        const columns = this.getColmuns();
        const { retrieveRequestQuantity } = this.props;
        return (
            <div>
                <Spin spinning={retrieveRequestQuantity > 0}>
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
        customers: getCustomers(state),
        byCustomers: getByCustomers(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(customerActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerList);