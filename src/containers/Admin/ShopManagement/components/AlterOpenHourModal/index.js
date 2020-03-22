// import React from "react";
// import {
//     Form,
//     Input,
//     Tooltip,
//     Icon,
//     Button,
//     InputNumber,
//     TimePicker,
//     Modal,
//     message,
//     Select
// } from "antd";
// import { removePointById } from "../../../../../utils/commonUtils";
// import moment from 'moment';
// import "./style.css";

// const { Option } = Select;
// const format = 'HH:mm';

// class AlterOpenHour extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             openHours: [0],
//             byOpenHours: {
//                 0: { endTime: null, startTime: null, repeat: new Array(), endStatus: "success", startStatus: "success", repeatStatus: "success" }
//             }
//         }
//     }

//     handleOk = e => {

//         this.props.handleOk();
//     };

//     handleCancel = e => {
//         this.props.handleCancel();
//     };

//     handleStartTimePickerChange = (time, timeString, index) => {
//         this.props.handleStartTimePickerChange(time, timeString, index)
//     }

//     handleEndTimePickerChange = (time, timeString, index) => {
//         this.props.handleEndTimePickerChange(time, timeString, index);
//     }

//     handleRepeatChange = (value, index) => {
//         console.log("repeat change",value)
//         this.props.handleRepeatChange(value, index);
//     }

//     handleAddOpenHour = () => {
//         this.props.handleAddOpenHour();
//     }

//     handleRemoveOpenHour = (index) => {
//         this.props.handleRemoveOpenHour(index);
//     }

//     render() {
//         const formItemLayout = {
//             labelCol: {
//                 xs: { span: 24 },
//                 sm: { span: 24 },
//             },
//             wrapperCol: {
//                 xs: { span: 24 },
//                 sm: { span: 24 },
//             },
//         };
//         const { visible, openHours, byOpenHours } = this.props;
//         // const { openHours, byOpenHours } = this.state;
//         return (
//             <div>
//                 <Modal
//                     title="更改营业时间"
//                     visible={visible}
//                     onOk={this.handleOk}
//                     style={{width:"600px"}}
//                     onCancel={this.handleCancel}
//                 >
//                     <Form {...formItemLayout}>
//                         <Form.Item>
//                             {openHours != null && openHours != undefined && openHours.length > 0 &&
//                                 openHours.map((id,index) => {
//                                     return (
//                                         <div key={id} >
//                                             <Form.Item
//                                                 validateStatus={byOpenHours[id].startStatus}
//                                                 help={byOpenHours[id].startStatus === "success" ? "" : "请输入门店开始营业时间"}
//                                                 style={{ display: 'inline-block' }}>
//                                                 <TimePicker
//                                                     value={byOpenHours[id].startTime && moment(byOpenHours[id].startTime, format)}
//                                                     format={format}
//                                                     placeholder="选择开始时间"
//                                                     onChange={(time, timeString) => this.handleStartTimePickerChange(time, timeString, id)} />
//                                             </Form.Item>
//                                             <span style={{ display: 'inline-block', width: '24px', textAlign: 'center', height: "100%" }}>-</span>
//                                             <Form.Item
//                                                 validateStatus={byOpenHours[id].endStatus}
//                                                 help={byOpenHours[id].endStatus === "success" ? "" : "请输入门店打烊时间"}
//                                                 style={{ display: 'inline-block' }}>
//                                                 <TimePicker
//                                                     value={byOpenHours[id].endTime && moment(byOpenHours[id].endTime, format)}
//                                                     format={format}
//                                                     placeholder="选择打烊时间"
//                                                     onChange={(time, timeString) => this.handleEndTimePickerChange(time, timeString, id)} />
//                                             </Form.Item>
//                                             <span style={{ display: 'inline-block', width: '50px', textAlign: 'center' }}>重复</span>
//                                             <Form.Item
//                                                 validateStatus={byOpenHours[id].repeatStatus}
//                                                 help={byOpenHours[id].repeatStatus === "success" ? "" : "请选择重复时间"}
//                                                 style={{ display: 'inline-block', width: "100px" }}>
//                                                 <Select
//                                                     mode="tags"
//                                                     onChange={(value) => this.handleRepeatChange(value, id)}
//                                                     tokenSeparators={[',']}
//                                                     value={byOpenHours[id].repeat}
//                                                     style={{ width: "100%" }}>
//                                                     <Option key={1}>周一</Option>
//                                                     <Option key={2}>周二</Option>
//                                                     <Option key={3}>周三</Option>
//                                                     <Option key={4}>周四</Option>
//                                                     <Option key={5}>周五</Option>
//                                                     <Option key={6}>周六</Option>
//                                                     <Option key={7}>周日</Option>
//                                                 </Select>
//                                             </Form.Item>
//                                             {index == 0 ?
//                                                 (<Tooltip title="新增营业时间">
//                                                     <Icon
//                                                         className="hover-pointer dynamic-button"
//                                                         type="plus-circle"
//                                                         onClick={this.handleAddOpenHour} />
//                                                 </Tooltip>)
//                                                 : (<Tooltip title="删除此时间">
//                                                     <Icon
//                                                         className="hover-pointer dynamic-button"
//                                                         type="minus-circle-o"
//                                                         onClick={() => this.handleRemoveOpenHour(id)}
//                                                     />
//                                                 </Tooltip>
//                                                 )}
//                                         </div>
//                                     )
//                                 })}
//                         </Form.Item>
//                     </Form>
//                 </Modal>
//             </div>
//         );
//     }
// }


// export default AlterOpenHour;