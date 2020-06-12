import React from "react";
import { Button, Icon, Divider, Input, Spin, Modal, Tooltip, Table, Tag, Select, DatePicker } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as articleActions, getArticles, getByArticles, getTags, getByTags } from "../../../../../redux/modules/article";
import { fetchArticleStatus, fetchTimeRange } from "../../../../../utils/common";
import { Link } from "react-router-dom";
import Highlighter from 'react-highlight-words';
import { timeStampConvertToFormatTime, getNDaysAgoTimeStamp } from "../../../../../utils/timeUtil";
import moment from 'moment';

const { RangePicker } = DatePicker;
const { confirm } = Modal;
const { Option } = Select;
const format = "YYYY-MM-DD";

class ArticleList extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
        status: undefined,
        startDate: undefined,
        endDate: undefined,
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
        const { articles, byArticles, byTags } = this.props;
        let dataSource = new Array();
        try {
            articles.forEach((uid) => {
                const dataItem = {
                    key: uid,
                    ...byArticles[uid],
                    tags: byArticles[uid].tags.map(uid => <Tag key={uid}>{byTags[uid].name}</Tag>),
                    time: timeStampConvertToFormatTime(byArticles[uid].time),
                    status: byArticles[uid].enforceTerminal ? "已失效" : "展示中"
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
                title: '文章名称',
                dataIndex: 'title',
                key: 'title',
                ...this.getColumnSearchProps('title'),
            },
            {
                title: '文章标签',
                dataIndex: 'tags',
                key: 'tags',
            },
            {
                title: '发布时间',
                dataIndex: 'time',
                key: 'time',
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
                        <Tooltip title={`查看文章内容`}>
                            <a href={record.url} target="blank">查看</a>
                        </Tooltip>
                        {record.enforceTerminal ? null :
                            <span>
                                <Divider type="vertical" />
                                <Tooltip title={`不在网站展示此文章`}>
                                    <a onClick={() => this.terminalArticle(record.uid)}>失效</a>
                                </Tooltip>
                            </span>
                        }
                    </span>
                ),
            }
        ];
    }

    terminalArticle = (uid) => {
        console.log("terminal id", uid);
        const { byArticles } = this.props;
        const thiz = this;
        confirm({
            title: "确认",
            content: `确定将${byArticles[uid].title}失效吗?`,
            onOk() {
                thiz.props.terminalArticle(uid)
                    .then(() => {
                        thiz.props.callMessage("success", "文章失效成功");
                    })
                    .catch((err) => {
                        thiz.props.callMessage("error", "文章失效失败!" + err);
                    });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }


    componentDidMount() {
        this.props.fetchArticles().catch(err => this.props.callMessage("error", err));
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
        this.props.fetchArticles(status, { startDate, endDate });
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
        this.props.fetchArticles(value, { startDate, endDate })
            .catch(err => this.props.callMessage("error", err));
    }

    fetchAllArticles = () => {
        this.setState({ status: undefined, startDate: null, endDate: null });
        this.props.fetchArticles(fetchArticleStatus.all, fetchTimeRange["all"]())
            .catch(err => this.props.callMessage("error", err));
    }

    render() {
        const data = this.getDataSource();
        const columns = this.getColmuns();
        const { retrieveRequestQuantity } = this.props;
        const { status } = this.state;
        return (
            <div>
                <Spin spinning={retrieveRequestQuantity > 0}>
                    <span>默认加载最近三个月未失效文章</span>
                    <Button type="link" onClick={this.fetchAllArticles}>加载所有文章</Button>
                    <div>
                        <Select placeholder="请选择文章类型" onChange={this.handleSelectChange} style={{ width: 200 }} value={status}>
                            <Option value="all">所有文章</Option>
                            <Option value="valid">有效文章</Option>
                            <Option value="invalid">失效文章</Option>
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


const mapStateToProps = (state) => {
    return {
        articles: getArticles(state),
        byArticles: getByArticles(state),
        tags: getTags(state),
        byTags: getByTags(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(articleActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);