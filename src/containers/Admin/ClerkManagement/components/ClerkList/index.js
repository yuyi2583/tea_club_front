import React from "react";
import { Card, Table, Input, Button, Icon, Divider, Tooltip, Modal } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { actions as clerkActions, getByClerks, getClerks } from "../../../../../redux/modules/clerk";
import Highlighter from 'react-highlight-words';
import { sex } from "../../../../../utils/common";

const { confirm } = Modal;

class ClerkList extends React.Component {
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
        const { clerks, byClerks } = this.props;
        let dataSource = new Array();
        try {
            clerks.forEach((uid) => {
                if (!byClerks[uid]) {
                    return;
                }
                const dataItem = {
                    ...byClerks[uid],
                    key: uid,
                    shop: byClerks[uid].shop != null ? byClerks[uid].shop.name : "暂未分配门店",
                    position: byClerks[uid].position != null ? byClerks[uid].position.name : "暂未分配职位",
                    gender: sex[byClerks[uid].gender],
                    status:byClerks[uid].enforceTerminal?"离职":"在职",
                };
                dataSource.push(dataItem);
            })
        } catch (err) {
            dataSource = new Array();
        }
        return dataSource;
    }

    getColmuns = () => {
        const { match } = this.props;
        return [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: '性别',
                dataIndex: 'gender',
                key: 'gender',
                ...this.getColumnSearchProps('gender'),
            },
            {
                title: '职位',
                dataIndex: 'position',
                key: 'position',
                ...this.getColumnSearchProps('position'),
            },
            {
                title: '所属门店',
                dataIndex: 'shop',
                key: 'shop',
                ...this.getColumnSearchProps('shop'),
            },
            {
                title: '联系方式',
                dataIndex: 'contact',
                key: 'contact',
                ...this.getColumnSearchProps('contact'),
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
                        <Tooltip title={`查看${record.name}的详细信息`}>
                            <Link to={`${match.url}/clerk/${record.uid}`}>查看</Link>
                        </Tooltip>
                        {record.enforceTerminal ? null :
                            <span>
                                <Divider type="vertical" />
                                <Tooltip title={`将${record.name}失效`}>
                                    <a onClick={() => this.terminalClerk(record.uid)}>失效</a>
                                </Tooltip>
                            </span>
                        }
                    </span>
                ),
            }
        ];
    }

    componentDidMount() {
        this.props.fetchClerks().catch(err => this.props.callMessage("error", err));
    }

    terminalClerk = (uid) => {
        const { byClerks } = this.props;
        const thiz = this;
        confirm({
            title: "确认",
            content: `${byClerks[uid].name}已确认离职?`,
            onOk() {
                thiz.props.terminalClerk(uid)
                    .then(() => {
                        thiz.props.callMessage("success", "职员失效成功");
                    })
                    .catch(err => {
                        thiz.props.callMessage("error", "职员失效失败，" + err);
                    });;
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render() {
        const data = this.getDataSource();
        const columns = this.getColmuns();
        const { retrieveRequestQuantity } = this.props;
        return <Table
            columns={columns}
            loading={retrieveRequestQuantity > 0}
            dataSource={data} />;
    }
}
const mapStateToProps = (state, props) => {
    return {
        byClerks: getByClerks(state),
        clerks: getClerks(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(clerkActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClerkList);