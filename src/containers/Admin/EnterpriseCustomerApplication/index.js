import React from "react";
import { PageHeader, Button, Icon, Divider, Input, Spin, Tooltip, Table } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Highlighter from 'react-highlight-words';
import { actions as customerActions, getEnterpriseCustomerApplication, getByEnterpriseCustomerApplication } from "../../../redux/modules/customer";
import { enterpriseCustomerApplicationStatus } from "../../../utils/common";

class EnterpriseCustomerApplication extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
    };

    componentDidMount() {
        this.props.fetchEnterpriseCustomerApplication();
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
        const { enterpriseCustomerApplication, byEnterpriseCustomerApplication } = this.props;
        let dataSource = new Array();
        enterpriseCustomerApplication.length > 0 && enterpriseCustomerApplication.forEach((uid) => {
            try {
                const dataItem = {
                    key: uid,
                    ...byEnterpriseCustomerApplication[uid],
                    status: enterpriseCustomerApplicationStatus[byEnterpriseCustomerApplication[uid].status],
                };
                dataSource.push(dataItem);
            } catch (err) {
                // console.error(err);
            };

        })
        return dataSource;
    }

    getColmuns = () => {
        const { match } = this.props;
        return [
            {
                title: '申请编号',
                dataIndex: 'uid',
                key: 'uid',
                ...this.getColumnSearchProps('uid'),
            },
            {
                title: '申请人名称',
                dataIndex: 'customerName',
                key: 'customerName',
                width: '15%',
                ...this.getColumnSearchProps('customerName'),
            },
            {
                title: '申请公司',
                dataIndex: 'companyName',
                key: 'companyName',
                ...this.getColumnSearchProps('companyName'),
            },
            {
                title: '申请人联系方式',
                dataIndex: 'contact',
                key: 'contact',
                ...this.getColumnSearchProps('contact'),
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
                ...this.getColumnSearchProps('email'),
            },
            {
                title: '申请时间',
                dataIndex: 'applicationTime',
                key: 'applicationTime',
                ...this.getColumnSearchProps('applicationTime'),
            },
            {
                title: '审核状态',
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
                        {record.status == enterpriseCustomerApplicationStatus[0] ?
                            <Tooltip title={`开始审核`}>
                                <Button type="link" onClick={() => this.props.startApplicationCheck(record.uid)}>接受审核</Button>
                            </Tooltip>
                            : record.status == enterpriseCustomerApplicationStatus[1] ?
                                <span>
                                    <Tooltip title={`通过该申请`}>
                                        <Button type="link" onClick={() => this.props.admitApplication(record.uid)}>通过申请</Button>
                                    </Tooltip>
                                    <Divider type="vertical" />
                                    <Tooltip title={`拒绝该申请`}>
                                        <Button type="link" onClick={() => this.props.rejectApplication(record.uid)}>拒绝申请</Button>
                                    </Tooltip>
                                </span> : null}
                    </span>
                ),
            }
        ];
    }


    render() {
        const data = this.getDataSource();
        const columns = this.getColmuns();
        const { requestQuantity } = this.props;
        return (
            <PageHeader
                title="企业用户申请"
                onBack={this.props.handleBack}>
                <span>当前为最近3个月的申请数据</span>
                <Button type="link" onClick={() => this.props.fetchEnterpriseCustomerApplication(true)}>加载所有申请数据</Button>
                <Spin spinning={requestQuantity > 0}>
                    <Table
                        columns={columns}
                        loading={requestQuantity > 0}
                        dataSource={data} />
                </Spin>
            </PageHeader>
        )
    }
}
const mapStateToProps = (state, props) => {
    return {
        enterpriseCustomerApplication: getEnterpriseCustomerApplication(state),
        byEnterpriseCustomerApplication: getByEnterpriseCustomerApplication(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(customerActions, dispatch),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(EnterpriseCustomerApplication);