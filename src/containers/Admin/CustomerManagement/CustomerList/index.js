// import React from "react";
// import { Popover, Button, Icon, Divider, DatePicker, Input, Select, Spin, TreeSelect, Modal, Tooltip, Table, InputNumber } from "antd";
// import { bindActionCreators } from "redux";
// import { connect } from "react-redux";
// import { actions as productActions, getByProductDetail, getProductDetail, getProductType, getByProductType } from "../../../../redux/modules/product";
// import Highlighter from 'react-highlight-words';
// import { Link } from "react-router-dom";
// import { productStatus, requestType } from "../../../../utils/common";

// const { confirm } = Modal;

// class CustomerList extends React.Component {
//     state = {
//         searchText: '',
//         searchedColumn: '',
//         alterStorageUid: "",
//     };

//     componentDidMount() {
//         // this.props.fetchActivities();
//         this.props.fetchProductDetail(requestType.appRequest);
//         this.props.fetchProductType();
//     }

//     getColumnSearchProps = dataIndex => ({
//         filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
//             <div style={{ padding: 8 }}>
//                 <Input
//                     ref={node => {
//                         this.searchInput = node;
//                     }}
//                     placeholder={`Search ${dataIndex}`}
//                     value={selectedKeys[0]}
//                     onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//                     onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
//                     style={{ width: 188, marginBottom: 8, display: 'block' }}
//                 />
//                 <Button
//                     type="primary"
//                     onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
//                     icon="search"
//                     size="small"
//                     style={{ width: 90, marginRight: 8 }}
//                 >
//                     搜索
//             </Button>
//                 <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
//                     重置
//             </Button>
//             </div>
//         ),
//         filterIcon: filtered => (
//             <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
//         ),
//         onFilter: (value, record) =>
//             record[dataIndex]
//                 .toString()
//                 .toLowerCase()
//                 .includes(value.toLowerCase()),
//         onFilterDropdownVisibleChange: visible => {
//             if (visible) {
//                 setTimeout(() => this.searchInput.select());
//             }
//         },
//         render: text =>
//             this.state.searchedColumn === dataIndex ? (
//                 <Highlighter
//                     highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
//                     searchWords={[this.state.searchText]}
//                     autoEscape
//                     textToHighlight={text.toString()}
//                 />
//             ) : (
//                     text
//                 ),
//     });

//     handleSearch = (selectedKeys, confirm, dataIndex) => {
//         confirm();
//         this.setState({
//             searchText: selectedKeys[0],
//             searchedColumn: dataIndex,
//         });
//     };

//     handleReset = clearFilters => {
//         clearFilters();
//         this.setState({ searchText: '' });
//     };

//     getDataSource = () => {
//         const { productDetail, byProductDetail, byProductType } = this.props;
//         const { alterStorageUid } = this.state;
//         let dataSource = new Array();
//         productDetail.length > 0 && productDetail.forEach((uid) => {
//             try {
//                 const dataItem = {
//                     key: uid,
//                     ...byProductDetail[uid],
//                     status: productStatus[byProductDetail[uid].status],
//                     type: byProductType[byProductDetail[uid].type].type
//                 };
//                 dataSource.push(dataItem);
//             } catch (err) {
//                 // console.error(err);
//             };

//         })
//         return dataSource;
//     }

//     getColmuns = () => {
//         const { match } = this.props;
//         return [
//             {
//                 title: '产品名称',
//                 dataIndex: 'name',
//                 key: 'name',
//                 width: '15%',
//                 ...this.getColumnSearchProps('name'),
//             },
//             {
//                 title: '产品种类',
//                 dataIndex: 'type',
//                 key: 'type',
//                 width: '15%',
//                 ...this.getColumnSearchProps('type'),
//             },
//             {
//                 title: '产品价格',
//                 dataIndex: 'price',
//                 key: 'price',
//                 ...this.getColumnSearchProps('price'),
//             },
//             {
//                 title: '库存',
//                 dataIndex: 'storage',
//                 key: 'storage',
//                 ...this.getColumnSearchProps('storage'),
//             },
//             {
//                 title: '状态',
//                 dataIndex: 'status',
//                 key: 'status',
//                 ...this.getColumnSearchProps('status'),
//             },
//             {
//                 title: "操作",
//                 dataIndex: "action",
//                 key: "action",
//                 render: (text, record) => (
//                     <span>
//                         <Tooltip title={`查看详细信息`}>
//                             <Link to={`${match.url}/product/${record.uid}`}>查看</Link>
//                         </Tooltip>
//                         {record.status == productStatus[0] ? null : <span>
//                             <Divider type="vertical" />
//                             <Tooltip title={`下架该产品`}>
//                                 <Button type="link" onClick={() => this.terminalProductSale(record.uid)}>下架</Button>
//                             </Tooltip>
//                         </span>}
//                     </span>
//                 ),
//             }
//         ];
//     }

//     alterProductStorage = (uid) => {
//         console.log("alter sotrage id", uid);
//         // this.props.openModal();
//         this.setState({ alterStorageUid: uid });
//         // const { byProductDetail } = this.props;
//         // const thiz = this;
//         // confirm({
//         //     title: "确认",
//         //     content: `确定要下架${byProductDetail[uid].name}吗?`,
//         //     onOk() {
//         //         thiz.props.terminalProductSale(uid)
//         //             .then(() => {
//         //                 thiz.props.callMessage("success", "产品下架成功");
//         //             })
//         //             .catch(err => {
//         //                 thiz.props.callMessage("error", "产品下架失败" + err);
//         //             });
//         //     },
//         //     onCancel() {
//         //         console.log('Cancel');
//         //     },
//         // });
//     }

//     terminalProductSale = (uid) => {
//         console.log("terminal id", uid);
//         const { byProductDetail } = this.props;
//         const thiz = this;
//         confirm({
//             title: "确认",
//             content: `确定要下架${byProductDetail[uid].name}吗?`,
//             onOk() {
//                 thiz.props.terminalProductSale(uid)
//                     .then(() => {
//                         thiz.props.callMessage("success", "产品下架成功");
//                     })
//                     .catch(err => {
//                         thiz.props.callMessage("error", "产品下架失败" + err);
//                     });
//             },
//             onCancel() {
//                 console.log('Cancel');
//             },
//         });
//     }

//     render() {
//         const data = this.getDataSource();
//         const columns = this.getColmuns();
//         const { requestQuantity, modalVisible, modalRequestQuantity } = this.props;
//         return (
//             <div>
//                 <Spin spinning={requestQuantity > 0}>
//                     <Table
//                         columns={columns}
//                         loading={requestQuantity > 0}
//                         dataSource={data} />
//                 </Spin>
//             </div>
//         )
//     }
// }


// const mapStateToProps = (state, props) => {
//     return {
//         productDetail: getProductDetail(state),
//         byProductDetail: getByProductDetail(state),
//         productType: getProductType(state),
//         byProductType: getByProductType(state),
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//         ...bindActionCreators(productActions, dispatch),
//         // ...bindActionCreators(shopActions, dispatch),
//         // ...bindActionCreators(activityActions, dispatch)
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(CustomerList);