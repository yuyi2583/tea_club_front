import React from "react";
import { Button, Icon, Divider, Input, Spin, Modal, Tooltip, Table } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as productActions, getProducts, getByProducts } from "../../../../../redux/modules/product";
import Highlighter from 'react-highlight-words';
import { Link } from "react-router-dom";
import { productStatus } from "../../../../../utils/common";

const { confirm } = Modal;

class ProductList extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
        alterStorageUid: "",
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
        const { products, byProducts } = this.props;
        let dataSource = new Array();
        products.forEach((uid) => {
            try {
                const dataItem = {
                    key: uid,
                    ...byProducts[uid],
                    status: byProducts[uid].enforceTerminal ? productStatus["off_shelves"] : byProducts[uid].storage > 0 ? productStatus["on_sale"] : productStatus["sold_out"],
                    type: byProducts[uid].type.name,
                };
                dataSource.push(dataItem);
            } catch (err) {

            };

        })
        return dataSource;
    }

    getColmuns = () => {
        const { match } = this.props;
        return [
            {
                title: '产品名称',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: '产品种类',
                dataIndex: 'type',
                key: 'type',
                ...this.getColumnSearchProps('type'),
            },
            {
                title: '产品描述',
                dataIndex: 'description',
                ...this.getColumnSearchProps('description'),
            },
            {
                title: '库存',
                dataIndex: 'storage',
                key: 'storage',
                ...this.getColumnSearchProps('storage'),
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
                            <Link to={`${match.url}/product/${record.uid}`}>查看</Link>
                        </Tooltip>
                        {record.enforceTerminal ? null : <span>
                            <Divider type="vertical" />
                            <Tooltip title={`下架该产品`}>
                                <Button type="link" onClick={() => this.terminalProduct(record.uid)}>下架</Button>
                            </Tooltip>
                        </span>}
                    </span>
                ),
            }
        ];
    }

    //TODO 根据门店不同展示门店拥有商品
    terminalProduct = (uid) => {
        console.log("terminal id", uid);
        const { byProducts } = this.props;
        const thiz = this;
        confirm({
            title: "确认",
            content: `确定要下架${byProducts[uid].name}吗?`,
            onOk() {
                thiz.props.terminalProduct(uid)
                    .then(() => {
                        thiz.props.callMessage("success", "产品下架成功");
                    })
                    .catch(err => {
                        thiz.props.callMessage("error", "产品下架失败，" + err);
                    });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }


    componentDidMount() {
        this.props.fetchProducts().catch(err=>this.props.callMessage("error",err));
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
        products: getProducts(state),
        byProducts: getByProducts(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(productActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);