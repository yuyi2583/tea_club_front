import React from "react";
import { PageHeader, Button, Icon, Divider, DatePicker, Input, Select, Spin, TreeSelect, Modal, Tooltip, Table } from "antd";
import PictureCard from "../../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getShop, getShopList } from "../../../../redux/modules/shop";
import { actions as clerkActions, getAllPosition, getByAllPosition, getByAuthority, getByBelong } from "../../../../redux/modules/clerk";
import { getRequestQuantity } from "../../../../redux/modules/app";
import { Redirect } from "react-router-dom";
import { map } from "../../../../router";
import { sex } from "../../../../utils/common";
import { getExtra, getSubTitle } from "./method";
import { Link } from "react-router-dom";
import Highlighter from 'react-highlight-words';
import { handleBack, callMessage, activityType } from "../../../../utils/common";

const { Option } = Select;
const { confirm } = Modal;
const { MonthPicker, RangePicker } = DatePicker;
const { SHOW_PARENT } = TreeSelect;

class ActivityList extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
    };
    componentDidMount() {
        // this.props.startRequest();
        // this.props.fetchShopList();
        // this.props.fetchAllClerks();
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
                    充值
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
            if (!byClerks[item]) {
                return;
            }
            const dataItem = {
                ...byClerks[item],
                key: item,
                shopId: byClerks[item].shopId ? byShopList[byClerks[item].shopId].name : "暂未分配门店",
                position: byClerks[item].position ? byClerks[item].position.name : "暂未分配职位",
                sex: sex[byClerks[item].sex],
            };
            dataSource.push(dataItem);
        })
        return dataSource;
    }

    getColmuns = () => {
        const { match } = this.props;
        return [
            {
                title: '活动名称',
                dataIndex: 'name',
                key: 'name',
                width: '15%',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: '活动描述',
                dataIndex: 'description',
                key: 'description',
                width: '30%',
                ...this.getColumnSearchProps('description'),
            },
            {
                title: '持续时间',
                dataIndex: 'duration',
                key: 'duration',
                width: '20%',
                ...this.getColumnSearchProps('duration'),
            },
            {
                title: '优先级',
                dataIndex: 'priority',
                key: 'priority',
                ...this.getColumnSearchProps('priority'),
            },
            {
                title: "操作",
                dataIndex: "action",
                key: "action",
                render: (text, record) => (
                    <span>
                        <Tooltip title={`查看详细信息`}>
                            {/* <Link to={`${match.url}/role_detail/${record.uid}`}>查看</Link> */}
                            查看
                        </Tooltip>
                        <Divider type="vertical" />
                        <Tooltip title={`系统中删除`}>
                            {/* <a onClick={() => this.deleteRole(record.uid)}>删除</a> */}
                            删除
                        </Tooltip>
                    </span>
                ),
            }
        ];
    }

    deleteRole = (clerkId) => {
        console.log("delete clerk id", clerkId);
        const { byClerks } = this.props;
        const thiz = this;
        confirm({
            title: "确认",
            content: `确定要删除${byClerks[clerkId].name}吗?`,
            onOk() {
                thiz.props.deleteClerk(clerkId);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render() {
        const extra = getExtra(this.props);
        const subTitle = getSubTitle(this.props);
        const data = this.getDataSource();
        const columns = this.getColmuns();
        const { requestQuantity } = this.props;
        return (
            <div>
                <PageHeader
                    title="活动管理"
                    subTitle={subTitle}
                    onBack={() => handleBack()}
                    extra={extra}>
                    <Spin spinning={requestQuantity > 0}>
                        <Table
                            columns={columns}
                            loading={requestQuantity > 0}
                            dataSource={data} />
                    </Spin>
                </PageHeader>
            </div>
        )
    }
}


const mapStateToProps = (state, props) => {
    return {
        shop: getShop(state),
        byShopList: getShopList(state),
        requestQuantity: getRequestQuantity(state),
        allPositions: getAllPosition(state),
        byAllPositions: getByAllPosition(state),
        byAuthority: getByAuthority(state),
        byBelong: getByBelong(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(clerkActions, dispatch),
        ...bindActionCreators(shopActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityList);