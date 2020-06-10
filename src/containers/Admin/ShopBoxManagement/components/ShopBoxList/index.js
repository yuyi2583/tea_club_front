import React from "react";
import { Button, Icon, Divider, Input, Spin, Modal, Tooltip, Table } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getShopBoxes, getByShopBoxes } from "../../../../../redux/modules/shop";
import Highlighter from 'react-highlight-words';
import { Link } from "react-router-dom";

const { confirm } = Modal;

class ShopBoxList extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
    };

    componentDidMount() {
        this.props.fetchShopBoxes().catch(err => this.props.callMessage("error", err));
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
        const { shopBoxes, byShopBoxes } = this.props;
        let dataSource = new Array();
        shopBoxes.length > 0 && shopBoxes.forEach((uid) => {
            try {
                const dataItem = {
                    key: uid,
                    ...byShopBoxes[uid],
                    shopName: byShopBoxes[uid].shop==null?"无所属门店":byShopBoxes[uid].shop.name,
                    status: byShopBoxes[uid].enforceTerminal ? "失效" : "运营中",
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
                title: '编号',
                dataIndex: 'uid',
                key: 'uid',
                ...this.getColumnSearchProps('uid'),
            },
            {
                title: '包厢名称',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: '包厢描述',
                dataIndex: 'description',
                key: 'description',
                ...this.getColumnSearchProps('description'),
            },
            {
                title: '所属门店',
                dataIndex: 'shopName',
                key: 'shopName',
                ...this.getColumnSearchProps('shopName'),
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
                        <Tooltip title={`查看详细信息`}>
                            <Link to={`${match.url}/shop_box/${record.uid}`}>查看</Link>
                        </Tooltip>
                        {record.enforceTerminal ? null :
                            <span>
                                <Divider type="vertical" />
                                <Tooltip title={`将此包厢失效`}>
                                    <Button type="link" onClick={() => this.terminalShopBox(record.uid)}>失效</Button>
                                </Tooltip>
                            </span>
                        }
                    </span>
                ),
            }
        ];
    }

    terminalShopBox = (uid) => {
        const thiz = this;
        confirm({
            title: '确认失效?',
            content: '确认要将此包厢失效？',
            onCancel() {
            },
            onOk() {
                thiz.props.terminalShopBox(uid)
                    .then(() => {
                        thiz.props.callMessage("success", "包厢失效成功");
                    })
                    .catch(err => {
                        thiz.props.callMessage("error", "包厢失效失败，" + err);
                    });
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
                        loading={retrieveRequestQuantity > 0}
                        dataSource={data} />
                </Spin>
            </div>
        )
    }
}


const mapStateToProps = (state, props) => {
    return {
        shopBoxes: getShopBoxes(state),
        byShopBoxes: getByShopBoxes(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(shopActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopBoxList);