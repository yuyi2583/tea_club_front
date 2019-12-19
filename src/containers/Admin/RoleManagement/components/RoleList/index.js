import React from "react";
import { Card, Table, Input, Button, Icon, Divider, Tooltip } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { actions as clerkActions, getByClerks, getClerks } from "../../../../../redux/modules/clerk";
import { actions as appActions, getRequestQuantity } from "../../../../../redux/modules/app";
import Highlighter from 'react-highlight-words';
import { actions as shopActions, getShopList } from "../../../../../redux/modules/shop";
import {sex} from "../../../../../utils/common";

class RoleList extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
    };
    componentDidMount() {
        this.props.startRequest();
        this.props.fetchShopList();
        this.props.fetchAllClerks();
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
                    Search
            </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
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
        const { clerks, byClerks, byShopList } = this.props;
        let dataSource = new Array();
        clerks != null && clerks.length > 0 && byShopList != null && clerks.forEach((item) => {
            // debugger;
            if(!byClerks[item]){
                return;
            }
            const dataItem = {
                ...byClerks[item],
                key: item,
                shopId: byClerks[item].shopId ? byShopList[byClerks[item].shopId].name : "暂未分配门店",
                position: byClerks[item].position ? byClerks[item].position.name : "暂未分配职位",
                sex:sex[byClerks[item].sex],
            };
            dataSource.push(dataItem);
        })
        return dataSource;
    }

    getColmuns = () => {
        const { match } = this.props;
        return [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                width: '15%',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                width: '10%',
                ...this.getColumnSearchProps('sex'),
            },
            {
                title: '所属门店',
                dataIndex: 'shopId',
                key: 'shopId',
                width: '20%',
                ...this.getColumnSearchProps('shopId'),
            },
            {
                title: '职位',
                dataIndex: 'position',
                key: 'position',
                ...this.getColumnSearchProps('position'),
            },
            {
                title: '联系方式',
                dataIndex: 'contact',
                key: 'contact',
                ...this.getColumnSearchProps('contact'),
            },
            {
                title: "操作",
                dataIndex: "action",
                key: "action",
                render: (text, record) => (
                    <span>
                        <Tooltip title={`查看${record.name}的详细信息`}>
                            <Link to={`${match.url}/role_detail/${record.uid}`}>查看</Link>
                        </Tooltip>
                        <Divider type="vertical" />
                        <Tooltip title={`将${record.name}从系统中删除`}>
                            <a onClick={() => this.deleteRole(record.uid)}>删除</a>
                        </Tooltip>
                    </span>
                ),
            }
        ];
    }

    deleteRole = (clerkId) => {
        console.log("delete clerk id", clerkId);
        //TODO
    }

    render() {
        const data = this.getDataSource();
        const columns = this.getColmuns();
        const { requestQuantity } = this.props;
        return <Table
            columns={columns}
            loading={requestQuantity > 0}
            dataSource={data} />;
    }
}
const mapStateToProps = (state, props) => {
    return {
        byClerks: getByClerks(state),
        clerks: getClerks(state),
        requestQuantity: getRequestQuantity(state),
        byShopList: getShopList(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(clerkActions, dispatch),
        ...bindActionCreators(appActions, dispatch),
        ...bindActionCreators(shopActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleList);