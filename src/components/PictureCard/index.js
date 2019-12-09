import React from "react";
import { Upload, Modal, Icon } from "antd";
import PropTypes from "prop-types";
import {getBase64} from "../../utils/imageUtil";

class PictureCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
        }
    }

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handleDisplayChange=({fileList})=>{
        this.props.onChange(fileList);
    }

    render() {
        const {fileList,alterInfo}=this.props;
        const { previewVisible, previewImage } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    disabled={alterInfo ? false : true}
                    onChange={this.handleDisplayChange}
                >
                    {fileList.length >= 4 ? null : alterInfo ? uploadButton : null}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }

}


PictureCard.propTypes = {
    fileList: PropTypes.array.isRequired,
    alterInfo:PropTypes.bool,
    onChange:PropTypes.func.isRequired,
}

PictureCard.defaultProps = {
    alterInfo: true
}

export default PictureCard;