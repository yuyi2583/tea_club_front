import React from "react";
import { Descriptions, TimePicker } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as shopActions, getBoxes, getShopList } from "../../../../../redux/modules/shop";
import moment from 'moment';
import PictureCard from "../../../../../components/PictureCard";
import { actions as uiActions, getAlterInfoState } from "../../../../../redux/modules/ui";

const format = 'HH:mm';

class BoxView extends React.Component {
    state = {
        value: moment('12:08', format),
    };
    onChange = time => {
        console.log(time);
        this.setState({ value: time });
    };


    render() {
        const { match, byBoxes, byShopList,alterInfo } = this.props;
        const { shopId, boxId } = match.params;
        const fileList = byBoxes == null ? [] : byBoxes[boxId].img;
        return (
            <div>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="包厢名称">
                        {byBoxes[boxId].name}
                    </Descriptions.Item>
                    <Descriptions.Item label="包厢号">
                        {byBoxes[boxId].boxNum}
                    </Descriptions.Item>
                    <Descriptions.Item label="所属门店">
                        {byShopList[shopId].name}
                    </Descriptions.Item>
                    <Descriptions.Item label="费用">
                        {byBoxes[boxId].price}/小时
                    </Descriptions.Item>
                    <Descriptions.Item label="开放时间" span={2}>
                        {byBoxes[boxId].startTime}~{byBoxes[boxId].endTime}
                        {/* <TimePicker
                            defaultValue={moment('12:08', format)}
                            value={this.state.value}
                            format={format}
                            onChange={this.onChange}
                        /> */}
                    </Descriptions.Item>
                    <Descriptions.Item label="包厢介绍" span={2}>
                        {byBoxes[boxId].description}
                    </Descriptions.Item>
                    <Descriptions.Item label="包厢照片" span={2}>
                        <PictureCard
                            fileList={fileList}
                            alterInfo={alterInfo}
                            onChange={this.handleDisplayChange} />
                    </Descriptions.Item>
                </Descriptions>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        byBoxes: getBoxes(state),
        byShopList: getShopList(state),
        alterInfo: getAlterInfoState(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(shopActions, dispatch),
        ...bindActionCreators(uiActions, dispatch),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(BoxView);