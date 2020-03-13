import React from "react";
import { PageHeader, Button, Icon, Divider, DatePicker, Input, Select, Spin, TreeSelect, Modal, Tooltip, Table } from "antd";
import PictureCard from "../../../../components/PictureCard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getShop, getShopList } from "../../../../redux/modules/shop";
import { actions as clerkActions, getAllPosition, getByAllPosition, getByAuthority, getByBelong } from "../../../../redux/modules/clerk";
import { actions as activityActions, getActivities, getByActivities } from "../../../../redux/modules/activity";
import { getRetrieveRequestQuantity } from "../../../../redux/modules/app";
import { Redirect } from "react-router-dom";
import { map } from "../../../../router";
import { sex, activityStatus } from "../../../../utils/common";
import { judgeStatus } from "./method";
import { Link } from "react-router-dom";
import Highlighter from 'react-highlight-words';
import { activityType } from "../../../../utils/common";
import { timeStampConvertToFormatTime } from "../../../../utils/timeUtil";
import { stringWithEllipsis } from "../../../../utils/stringUtil";

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
        this.props.fetchActivities();
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
        const { activities, byActivities } = this.props;
        let dataSource = new Array();
        activities.length > 0 && activities.forEach((item) => {
            let status = judgeStatus(byActivities[item]);
            if (status == null) {
                return;
            }
            const dataItem = {
                key: item,
                ...byActivities[item],
                description: stringWithEllipsis(byActivities[item].description, 30),
                status: byActivities[item].status != null && byActivities[item].status != undefined ? activityStatus[byActivities[item].status] : status,
                duration: timeStampConvertToFormatTime(byActivities[item].startTime) + "~" + timeStampConvertToFormatTime(byActivities[item].endTime)
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
                width: '20%',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: '活动描述',
                dataIndex: 'description',
                key: 'description',
                width: '25%',
                ...this.getColumnSearchProps('description'),
            },
            {
                title: '持续时间',
                dataIndex: 'duration',
                key: 'duration',
                width: '30%',
                ...this.getColumnSearchProps('duration'),
            },
            {
                title: '活动状态',
                dataIndex: 'status',
                key: 'status',
                ...this.getColumnSearchProps('duration'),
            },
            {
                title: "操作",
                dataIndex: "action",
                key: "action",
                render: (text, record) => (
                    <span>
                        <Tooltip title={`查看详细信息`}>
                            <Link to={`${match.url}/activity/${record.uid}`}>查看</Link>
                        </Tooltip>
                        <Divider type="vertical" />
                        <Tooltip title={`终止活动`}>
                            {record.enforceTerminal || judgeStatus(record) == "expired" ? null :
                                <a onClick={() => this.terminalActivity(record.uid)}>终止</a>
                            }
                        </Tooltip>
                    </span>
                ),
            }
        ];
    }

    terminalActivity = (uid) => {
        console.log("terminal id", uid);
        const { byActivities } = this.props;
        const thiz = this;
        confirm({
            title: "确认",
            content: `确定要终止${byActivities[uid].name}吗?`,
            onOk() {
                thiz.props.terminalActivity(uid);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render() {
        const data = this.getDataSource();
        const columns = this.getColmuns();
        const { requestQuantity } = this.props;
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


const mapStateToProps = (state, props) => {
    return {
        shop: getShop(state),
        byShopList: getShopList(state),
        requestQuantity: getRetrieveRequestQuantity(state),
        allPositions: getAllPosition(state),
        byAllPositions: getByAllPosition(state),
        byAuthority: getByAuthority(state),
        byBelong: getByBelong(state),
        activities: getActivities(state),
        byActivities: getByActivities(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(clerkActions, dispatch),
        ...bindActionCreators(shopActions, dispatch),
        ...bindActionCreators(activityActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityList);