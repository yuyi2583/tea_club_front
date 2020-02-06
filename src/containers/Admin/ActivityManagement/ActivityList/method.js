import { Button,Tooltip } from "antd";
import React from "react";

export const getExtra = ({ history, match }) => {
    let extra = null;
    if (history.location.pathname.indexOf("role_detail") != -1) {
        extra = (<Button type="primary" onClick={this.startAlterRoleDetail}>修改职员信息</Button>);
    } else {
        extra = null;
    }
    return extra;
}

export const getSubTitle = ({ history }) => {
    let subTitle = null;
    if (history.location.pathname.indexOf("new_role_detail") != -1) {
        subTitle = "新增职员详情";
    } else {
        subTitle = null;
    }
    return subTitle;
}

// export const getColmuns = () => {
//     const { match } = this.props;
//     return [
//         {
//             title: '姓名',
//             dataIndex: 'name',
//             key: 'name',
//             width: '15%',
//             ...this.getColumnSearchProps('name'),
//         },
//         {
//             title: '性别',
//             dataIndex: 'sex',
//             key: 'sex',
//             width: '10%',
//             ...this.getColumnSearchProps('sex'),
//         },
//         {
//             title: '所属门店',
//             dataIndex: 'shopId',
//             key: 'shopId',
//             width: '20%',
//             ...this.getColumnSearchProps('shopId'),
//         },
//         {
//             title: '职位',
//             dataIndex: 'position',
//             key: 'position',
//             ...this.getColumnSearchProps('position'),
//         },
//         {
//             title: '联系方式',
//             dataIndex: 'contact',
//             key: 'contact',
//             ...this.getColumnSearchProps('contact'),
//         },
//         {
//             title: "操作",
//             dataIndex: "action",
//             key: "action",
//             render: (text, record) => (
//                 <span>
//                     <Tooltip title={`查看${record.name}的详细信息`}>
//                         <Link to={`${match.url}/role_detail/${record.uid}`}>查看</Link>
//                     </Tooltip>
//                     <Divider type="vertical" />
//                     <Tooltip title={`将${record.name}从系统中删除`}>
//                         <a onClick={() => this.deleteRole(record.uid)}>删除</a>
//                     </Tooltip>
//                 </span>
//             ),
//         }
//     ];
// }

// const getColumnSearchProps = dataIndex => ({
//     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
//         <div style={{ padding: 8 }}>
//             <Input
//                 ref={node => {
//                     this.searchInput = node;
//                 }}
//                 placeholder={`Search ${dataIndex}`}
//                 value={selectedKeys[0]}
//                 onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//                 onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
//                 style={{ width: 188, marginBottom: 8, display: 'block' }}
//             />
//             <Button
//                 type="primary"
//                 onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
//                 icon="search"
//                 size="small"
//                 style={{ width: 90, marginRight: 8 }}
//             >
//                 搜索
//         </Button>
//             <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
//                 充值
//         </Button>
//         </div>
//     ),
//     filterIcon: filtered => (
//         <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
//     ),
//     onFilter: (value, record) =>
//         record[dataIndex]
//             .toString()
//             .toLowerCase()
//             .includes(value.toLowerCase()),
//     onFilterDropdownVisibleChange: visible => {
//         if (visible) {
//             setTimeout(() => this.searchInput.select());
//         }
//     },
//     render: text =>
//         this.state.searchedColumn === dataIndex ? (
//             <Highlighter
//                 highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
//                 searchWords={[this.state.searchText]}
//                 autoEscape
//                 textToHighlight={text.toString()}
//             />
//         ) : (
//                 text
//             ),
// });