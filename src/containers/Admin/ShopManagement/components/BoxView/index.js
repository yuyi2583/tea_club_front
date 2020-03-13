import React from "react";
import { Descriptions, TimePicker, Input, Select, InputNumber, Empty, Row, Col, Button } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getBoxes, getShopList, getShop } from "../../../../../redux/modules/shop";
import moment from 'moment';
import PictureCard from "../../../../../components/PictureCard";
import { actions as uiActions, getAlterInfoState } from "../../../../../redux/modules/ui";
import { getRetrieveRequestQuantity } from "../../../../../redux/modules/app";

const format = 'HH:mm';
const { Option } = Select;
const { TextArea } = Input;

class BoxView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    componentDidMount() {
        if(this.props.location.alterInfo){
            this.props.startAlterInfo();
        }
        const { byBoxes, match } = this.props;
        const { boxId } = match.params;
        this.setState({ ...byBoxes[boxId] });
    }

    handleChange = (e) => {
        const name = e.target.name;
        this.setState({
            [name]: e.target.value
        })
    }

    handleInputNumChange = (value) => {
        this.setState({ price: value })
    }

    handleStartTimePickerChange = (time, timeString) => {
        this.setState({ startTime: timeString })
    }

    handleEndTimePickerChange = (time, timeString) => {
        this.setState({ endTime: timeString })
    }

    forDisplay = () => {
        const { byBoxes, match } = this.props;
        const { boxId } = match.params;
        if (byBoxes[boxId] === null || byBoxes[boxId].img === null) {
            return {
                fileListInProps: new Array(),
                fileListInState: new Array()
            };
        }
        const fileListInProps = byBoxes[boxId].img;
        const fileListInState = this.state.img == null ? new Array() : this.state.img;
        return {
            fileListInProps,
            fileListInState
        };
    }

    handleDisplayChange = (fileList) => {
        // let img = new Array();
        // for (var key in fileList) {
        //     img.push(fileList[key].uid);
        // }
        this.setState({ img: fileList });
        // this.props.setDisplay(display);
    };

    completeAlter = () => {
        const newBoxInfo=this.state;
        this.props.alterBoxInfo(newBoxInfo);
    }

    handleCancelAlter = () => {
        const { byBoxes, match } = this.props;
        const { boxId } = match.params;
        this.setState({ ...byBoxes[boxId] });
        this.props.finishAlterInfo();
    }

    componentWillUnmount(){
        this.props.finishAlterInfo();
    }

    render() {
        const { match, byBoxes, byShopList, alterInfo, requestQuantity } = this.props;
        const { shopId, boxId } = match.params;
        const { fileListInProps, fileListInState } = this.forDisplay();
        // const selectChildren=this.getSelectChildren();
        return (
            <div>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="包厢名称">
                        {!alterInfo ?
                            byBoxes[boxId].name
                            : <Input value={this.state.name} allowClear name="name" onChange={this.handleChange} />
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="包厢号">
                        {!alterInfo ?
                            byBoxes[boxId].boxNum
                            : <Input value={this.state.boxNum} allowClear name="boxNum" onChange={this.handleChange} />
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="所属门店">
                        {/* {!alterInfo ? */}
                        {byShopList[shopId].name
                            // : <Select
                            //     showSearch
                            //     style={{ width: 200 }}
                            //     placeholder="请选择门店"
                            //     defaultValue={shopId}
                            //     optionFilterProp="children"
                            //     onChange={this.handleSelectChange}
                            //     filterOption={(input, option) =>
                            //         option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            //     }
                            // >
                            //     {selectChildren}
                            // </Select>
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="费用">
                        {!alterInfo ?
                            byBoxes[boxId].price + "/小时"
                            : <InputNumber
                                defaultValue={this.state.price}
                                min={0}
                                onChange={this.handleInputNumChange}
                            />
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="开放时间" span={2}>
                        {!alterInfo ?
                            byBoxes[boxId].startTime + " ~ " + byBoxes[boxId].endTime
                            : <div>
                                <TimePicker value={moment(this.state.startTime, format)} format={format} onChange={this.handleStartTimePickerChange} />
                                &nbsp; ~ &nbsp;
                                <TimePicker value={moment(this.state.endTime, format)} format={format} onChange={this.handleEndTimePickerChange} />
                            </div>
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="包厢介绍" span={2}>
                        {!alterInfo ?
                            byBoxes[boxId].description
                            : <TextArea rows={4} name="description" onChange={this.handleChange} allowClear value={this.state.description} />
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="包厢照片" span={2}>
                        {alterInfo ?
                            <PictureCard
                                fileList={fileListInState}
                                state
                                alterInfo={alterInfo}
                                onChange={this.handleDisplayChange} />
                            : fileListInProps.length == null || fileListInProps == 0 ?
                                <Empty />
                                : <PictureCard
                                    props
                                    fileList={fileListInProps}
                                    alterInfo={alterInfo} 
                                    onChange={this.handleDisplayChange} />
                        }
                    </Descriptions.Item>
                </Descriptions>
                {alterInfo ?
                    <Row style={{ margin: "20px 0" }}>
                        <Col span={12} offset={4}>
                            <Button type="primary" block onClick={this.completeAlter} loading={requestQuantity > 0} >{requestQuantity > 0 ? "" : "确认修改"}</Button>
                        </Col>
                        <Col span={4} push={4}>
                            <Button block onClick={this.handleCancelAlter}>取消修改</Button>
                        </Col>
                    </Row>
                    : null}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        byBoxes: getBoxes(state),
        byShopList: getShopList(state),
        shop: getShop(state),
        requestQuantity: getRetrieveRequestQuantity(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(shopActions, dispatch),
        ...bindActionCreators(uiActions, dispatch),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(BoxView);