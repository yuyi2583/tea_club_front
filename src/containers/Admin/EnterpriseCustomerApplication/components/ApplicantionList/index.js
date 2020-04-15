import React from "react";
import { PageHeader, Button, Icon, Divider, Input, Spin, Tooltip, Table } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Highlighter from 'react-highlight-words';
import { actions as customerActions, getEnterpriseCustomerApplications, getByEnterpriseCustomerApplications } from "../../../../../redux/modules/customer";
import { enterpriseCustomerApplicationStatus } from "../../../../../utils/common";
import { Link, Redirect } from "react-router-dom";
import { map } from "../../../../../router";

class ApplicationList extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
        from: null,
    };

    componentDidMount() {
        this.props.fetchEnterpriseCustomerApplication().catch(err=>this.props.callMessage("error",err));
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
        const { enterpriseCustomerApplications, byEnterpriseCustomerApplications } = this.props;
        let dataSource = new Array();
        try {
            enterpriseCustomerApplications.forEach((uid) => {
                try {
                    const dataItem = {
                        key: uid,
                        ...byEnterpriseCustomerApplications[uid],
                        customerName: byEnterpriseCustomerApplications[uid].applicant.name,
                        companyName: byEnterpriseCustomerApplications[uid].enterprise.name,
                        contact: byEnterpriseCustomerApplications[uid].applicant.contact,
                        email: byEnterpriseCustomerApplications[uid].applicant.email,
                        status: enterpriseCustomerApplicationStatus[byEnterpriseCustomerApplications[uid].status],
                    };
                    dataSource.push(dataItem);
                } catch (err) {
                    // console.error(err);
                };

            })
        } catch{

        }
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
                dataIndex: 'applyTime',
                key: 'applyTime',
                ...this.getColumnSearchProps('applyTime'),
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
                        {record.status == enterpriseCustomerApplicationStatus["submit"] ?
                            <Tooltip title={`开始审核`}>
                                <Button type="link" onClick={() => this.startApplicationCheck(record.uid)}>接受审核</Button>
                            </Tooltip>
                            : record.status == enterpriseCustomerApplicationStatus["pending"] ?
                                <Tooltip title={`编辑申请`}>
                                    <Link to={`${match.url}/enterprise_customer_application/${record.uid}`}>编辑</Link>
                                </Tooltip> :
                                <Tooltip title={`查看申请`}>
                                <Link to={`${match.url}/enterprise_customer_application/${record.uid}`}>查看</Link>
                            </Tooltip>
                        }
                    </span>
                ),
            }
        ];
    }

    startApplicationCheck = (uid) => {
        const { match } = this.props;
        this.props.startApplicationCheck(uid)
            .then(() => {
                this.setState({ from: `${match.url}/enterprise_customer_application/${uid}` })
            })
            .catch(err => {
                this.props.callMessage("error", "开始审核失败，" + err);
            })
    }


    render() {
        const { from } = this.state;
        if (from != null) {
            return <Redirect to={from} />;
        }
        const data = this.getDataSource();
        const columns = this.getColmuns();
        const { retrieveRequestQuantity } = this.props;
        return (
            <div>
                <span>当前为最近3个月的申请数据</span>
                <Button type="link" onClick={() => this.props.fetchEnterpriseCustomerApplication(true)}>加载所有申请数据</Button>
                <Spin spinning={retrieveRequestQuantity > 0}>
                    <Table
                        columns={columns}
                        dataSource={data} />
                </Spin>
            </div>
        )
    }
}
// const mapStateToProps = (state, props) => {
//     return {
//         enterpriseCustomerApplications: getEnterpriseCustomerApplications(state),
//         byEnterpriseCustomerApplications: getByEnterpriseCustomerApplications(state)
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//         ...bindActionCreators(customerActions, dispatch),
//     };
// };


export default ApplicationList;//connect(mapStateToProps, mapDispatchToProps)(ApplicationList);