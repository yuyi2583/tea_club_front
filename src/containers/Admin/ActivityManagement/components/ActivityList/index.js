import React from "react";
import {  Button, Icon, Divider, Input, Spin, Modal, Tooltip, Table } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as activityActions, getActivities, getByActivities } from "../../../../../redux/modules/activity";
import {  activityStatus } from "../../../../../utils/common";
import { judgeStatus } from "./method";
import { Link } from "react-router-dom";
import Highlighter from 'react-highlight-words';
import { timeStampConvertToFormatTime } from "../../../../../utils/timeUtil";
import { stringWithEllipsis } from "../../../../../utils/stringUtil";

const { confirm } = Modal;

class ActivityList extends React.Component {
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
        const { activities, byActivities } = this.props;
        let dataSource = new Array();
        try {
            activities.forEach((item) => {
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
        } catch{
            dataSource = new Array();
        }
        return dataSource;
    }

    getColmuns = () => {
        const { match } = this.props;
        return [
            {
                title: '活动名称',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: '活动描述',
                dataIndex: 'description',
                key: 'description',
                ...this.getColumnSearchProps('description'),
            },
            {
                title: '持续时间',
                dataIndex: 'duration',
                key: 'duration',
                ...this.getColumnSearchProps('duration'),
            },
            {
                title: '活动状态',
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
                        <Tooltip title={`查看详细信息`}>
                            <Link to={`${match.url}/activity/${record.uid}`}>查看</Link>
                        </Tooltip>
                        <Divider type="vertical" />
                        <Tooltip title={`终止活动`}>
                            {record.enforceTerminal || judgeStatus(record) == activityStatus["expired"] ? null :
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
                thiz.props.terminalActivity(uid)
                .then(()=>{
                    thiz.props.callMessage("success","活动终止成功");
                })
                .catch((err)=>{
                    thiz.props.callMessage("error","活动终止失败"+err);
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }


    componentDidMount() {
        this.props.fetchActivities();
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


const mapStateToProps = (state) => {
    return {
        activities: getActivities(state),
        byActivities: getByActivities(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(activityActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityList);