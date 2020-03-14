import React from "react";
import { Upload, Modal, Icon } from "antd";
import PropTypes from "prop-types";
import { getBase64 } from "../../utils/imageUtil";
// import { bindActionCreators } from "redux";
// import { connect } from "react-redux";
// import {actions as photoActions} from "../../redux/modules/photo";

class PictureCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: new Array(),
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

    handleDisplayChange = ({ file, fileList }) => {
        console.log("file", file);
        if (file.status == "done") {
            this.props.onChange(file.response.data);
        }
        this.setState({ fileList })
        // this.props.onChange(info.fileList);
    }

    render() {
        const { alterInfo, max } = this.props;
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="http://localhost:8080/savephoto"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    disabled={alterInfo ? false : true}
                    onChange={this.handleDisplayChange}
                >
                    {fileList.length >= max ? null : alterInfo ? uploadButton : null}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }

}


PictureCard.propTypes = {
    fileList: PropTypes.array,
    alterInfo: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    max: PropTypes.number,
}

PictureCard.defaultProps = {
    alterInfo: true,
    max: 4
}


// const mapStateToProps = (state, props) => {
//     return {
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//         ...bindActionCreators(photoActions, dispatch),
//     };
// };

export default PictureCard//connect(mapStateToProps, mapDispatchToProps)(PictureCard);
