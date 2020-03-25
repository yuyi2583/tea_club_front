// import React from "react";
// import { Descriptions, Row, Col, Skeleton, Typography, Button, Spin, Input, Select, Empty, Form, DatePicker, Modal, InputNumber } from "antd";
// import { bindActionCreators } from "redux";
// import { connect } from "react-redux";
// // import { actions as activityActions, getActivities, getbyProductDetail, getByActivityRules } from "../../../../redux/modules/activity";
// // import { actions as uiActions, getAlterInfoState } from "../../../../redux/modules/ui";
// // import { actions as appActions, 
// //     // getRetrieveRequestQuantity, getModalRequestQuantity
// //  } from "../../../../redux/modules/app";
// import { actions as productActions, getProductType, getByProductType, getByProductDetail, getProductDetail } from "../../../../../redux/modules/product";
// // import { actions as customerActions, getCustomerType, getByCustomerType } from "../../../../redux/modules/customer";
// import { Prompt, Redirect } from "react-router-dom";
// // import { timeStampConvertToFormatTime, timeStringConvertToTimeStamp } from "../../../../utils/timeUtil";
// import moment from 'moment';
// import { activityType, requestType } from "../../../../../utils/common";
// import PictureCard from "../../../../../components/PictureCard";
// // import ActivityRuleInput from "../../../../components/ActivityRuleInput";
// // import DynamicFieldSet from "../../../../components/DynamicFieldSet";
// // import { activityApplyForProduct } from "../../../../utils/commonUtils";
// import { map } from "../../../../../router";

// const { RangePicker } = DatePicker;
// const { Paragraph } = Typography;
// const { TextArea } = Input;
// const { Option } = Select;
// const dateFormat = 'YYYY-MM-DD HH:mm:ss';
// const { confirm } = Modal;

// class ProductDetail extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             fileList: new Array(),
//             from: null,
//         }
//     }

//     getFileList = (item) => {
//         return item != null || item != undefined ? [{
//             uid: '-1',
//             name: 'image.png',
//             status: 'done',
//             url: item,
//         }] : [];
//     }

//     componentDidMount() {
//         this.props.fetchProductDetail();
//         this.props.fetchProductType();
//     }

//     componentWillUnmount() {
//         this.props.finishAlterInfo();
//     }

//     handleSubmit = e => {
//         e.preventDefault();
//         const { fileList } = this.state;;
//         const { byAuthority } = this.props;
//         const thiz = this;
//         this.props.form.validateFieldsAndScroll((err, values) => {
//             if (!err) {
//                 confirm({
//                     title: '确认修改?',
//                     content: '输入数据是否无误，确认修改该产品信息',
//                     onCancel() {
//                     },
//                     onOk() {
//                         console.log("submit values", values);
//                         thiz.props.alterProductInfo(values)
//                             .then(() => {
//                                 thiz.props.callMessage("success", "修改产品信息成功！")
//                                 thiz.setState({
//                                     from: map.admin.AdminHome() + `/product_management/products`
//                                 });
//                             })
//                             .catch((err) => {
//                                 thiz.props.callMessage("error", "修改产品信息失败！" + err)
//                         })
//                     },
//                 });

//             }
//         });
//     };

//     // forDisplay = () => {
//     //     const { shopInfo } = this.props.shop;
//     //     if (shopInfo === null) {
//     //         return {
//     //             fileListInProps: new Array(),
//     //             fileListInState: new Array()
//     //         };
//     //     }
//     //     const { byDisplay } = this.props;
//     //     const fileListInProps = shopInfo.display.map((displayId) => byDisplay[displayId]);
//     //     const shopInfoInState = this.state.shopInfo;
//     //     const fileListInState = shopInfoInState.display.map((displayId) => byDisplay[displayId]);
//     //     return {
//     //         fileListInProps,
//     //         fileListInState
//     //     };
//     // }

//     render() {
//         const { from } = this.state;
//         if (from != null) {
//             return <Redirect to={from} />;
//         }
//         const { productId } = this.props.match.params;
//         const { activities, byProductDetail, alterInfo, requestQuantity, form, modalRequestQuantity,
//             byActivityRules, productType, byProductType, customerType, byCustomerType } = this.props;
//         const fileListInProps = this.getFileList(byProductDetail[productId].pictures);
//         const fileListInState = this.getFileList(this.state.pictures);
//         const { getFieldDecorator } = form;
//         return (
//             <div>
//                 <Spin spinning={requestQuantity > 0}>
//                     <Form onSubmit={this.handleSubmit}>
//                         <Descriptions bordered column={2}>
//                             <Descriptions.Item label="产品名称">
//                                 {requestQuantity > 0 ?
//                                     <Skeleton active /> :
//                                     !alterInfo ?
//                                         byProductDetail[productId].name
//                                         : <Form.Item>
//                                             {getFieldDecorator('name', {
//                                                 rules: [{ required: true, message: '请输入产品名称!' }],
//                                                 initialValue: byProductDetail[productId].name
//                                             })(<Input allowClear name="name" placeholder="请输入产品名称" />)}
//                                         </Form.Item>
//                                 }
//                             </Descriptions.Item>
//                             <Descriptions.Item label="产品种类" >
//                                 {requestQuantity > 0 ?
//                                     <Skeleton active /> :
//                                     !alterInfo ?
//                                         byProductType[byProductDetail[productId].type].type
//                                         : <Form.Item>
//                                             {getFieldDecorator('type', {
//                                                 rules: [{ required: true, message: '请选择产品种类!' }],
//                                                 initialValue: byProductDetail[productId].type
//                                             })(
//                                                 <Select
//                                                     loading={this.props.modalRequestQuantity > 0}
//                                                     placeholder="请选择产品种类"
//                                                     name="type"
//                                                     // onFocus={() => this.props.fetchCustomerType(requestType.modalRequest)}
//                                                     style={{ width: 200 }}
//                                                 >
//                                                     {
//                                                         productType.map((uid) => <Option key={uid} value={uid}>{byProductType[uid].type}</Option>)
//                                                     }
//                                                 </Select>
//                                             )}
//                                         </Form.Item>
//                                 }
//                             </Descriptions.Item>
//                             <Descriptions.Item label="产品描述" span={2}>
//                                 {requestQuantity > 0 ?
//                                     <Skeleton active /> :
//                                     !alterInfo ?
//                                         byProductDetail[productId].description
//                                         : <Form.Item>
//                                             {getFieldDecorator('description', {
//                                                 rules: [
//                                                     {
//                                                         required: true,
//                                                         message: "请输入产品描述！",
//                                                     }
//                                                 ],
//                                                 initialValue: byProductDetail[productId].description
//                                             })(
//                                                 <TextArea rows={4} allowClear placeholder="请输入产品描述" />
//                                             )}
//                                         </Form.Item>
//                                 }
//                             </Descriptions.Item>
//                             <Descriptions.Item label="价格（元）">
//                                 {requestQuantity > 0 ?
//                                     <Skeleton active /> :
//                                     !alterInfo ?
//                                         byProductDetail[productId].price :
//                                         <Form.Item>
//                                             {getFieldDecorator('price', {
//                                                 rules: [
//                                                     {
//                                                         required: true,
//                                                         message: "请输入产品价格！",
//                                                     }
//                                                 ],
//                                                 initialValue: byProductDetail[productId].price
//                                             })(
//                                                 <InputNumber min={0} allowClear placeholder="请输入产品价格" />
//                                             )}
//                                         </Form.Item>
//                                 }
//                             </Descriptions.Item>
//                             <Descriptions.Item label="库存（件）">
//                                 {requestQuantity > 0 ?
//                                     <Skeleton active /> :
//                                     !alterInfo ?
//                                         byProductDetail[productId].price :
//                                         <Form.Item>
//                                             {getFieldDecorator('storage', {
//                                                 rules: [
//                                                     {
//                                                         required: true,
//                                                         message: "请输入产品库存！",
//                                                     }
//                                                 ],
//                                                 initialValue: byProductDetail[productId].storage
//                                             })(
//                                                 <InputNumber min={0} allowClear placeholder="请输入产品库存" />
//                                             )}
//                                         </Form.Item>
//                                 }
//                             </Descriptions.Item>
//                             <Descriptions.Item label="照片">
//                                 {requestQuantity > 0 ?
//                                     <Skeleton active /> :
//                                     alterInfo ?
//                                         <PictureCard
//                                             fileList={fileListInState}
//                                             alterInfo={alterInfo}
//                                             p="state"
//                                             onChange={this.fileListOnChange} />
//                                         : byProductDetail[productId].pictures == null || byProductDetail[productId].pictures == undefined ?
//                                             <Empty />
//                                             : <PictureCard
//                                                 fileList={fileListInProps}
//                                                 p="props"
//                                                 alterInfo={alterInfo}
//                                                 onChange={this.fileListOnChange} />
//                                 }
//                             </Descriptions.Item>
//                         </Descriptions>
//                         {alterInfo &&
//                             <Row style={{ margin: "20px 0" }}>
//                                 <Col span={12} offset={4}>
//                                     <Button type="primary" htmlType="submit" block loading={requestQuantity > 0}>确认修改</Button>
//                                 </Col>
//                                 <Col span={4} push={4}>
//                                     <Button block onClick={() => this.props.finishAlterInfo()}>取消修改</Button>
//                                 </Col>
//                             </Row>
//                         }
//                     </Form>
//                 </Spin>
//                 <Prompt message="当前页面正在输入中，离开此页面您输入的数据不会被保存，是否离开?" when={alterInfo} />
//             </div>
//         );
//     }
// }

// const mapStateToProps = (state, props) => {
//     return {
//         // activities: getActivities(state),
//         // byProductDetail: getbyProductDetail(state),
//         // alterInfo: getAlterInfoState(state),
//         // // requestQuantity: getRetrieveRequestQuantity(state),
//         // byActivityRules: getByActivityRules(state),
//         // modalRequestQuantity: getModalRequestQuantity(state),
//         productType: getProductType(state),
//         byProductType: getByProductType(state),
//         productDetail: getProductDetail(state),
//         byProductDetail: getByProductDetail(state),
//         // customerType: getCustomerType(state),
//         // byCustomerType: getByCustomerType(state),
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//         // ...bindActionCreators(activityActions, dispatch),
//         // ...bindActionCreators(uiActions, dispatch),
//         // ...bindActionCreators(appActions, dispatch),
//         ...bindActionCreators(productActions, dispatch),
//         // ...bindActionCreators(customerActions, dispatch),
//     };
// };

// const WrapedProductDetail = Form.create({ name: 'activityDetail' })(ProductDetail);
// export default connect(mapStateToProps, mapDispatchToProps)(WrapedProductDetail);