import React from "react";
import { Upload, Modal, Icon } from "antd";
import PropTypes from "prop-types";
import {callNotification} from "../../utils/commonUtils";
import { getBase64 } from "../../utils/imageUtil";
import "./style.css";
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
        console.log("handle preview", file);

        // if (!file.url && !file.preview) {
        //     file.preview = await getBase64(file.originFileObj);
        // }

        this.setState({
            previewImage: file.thumbUrl || file.preview,
            previewVisible: true,
        });
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handleDisplayChange = ({ file, fileList }) => {
        console.log("file", file);
        console.log("file list", fileList);
        if(file.response!=undefined&&file.response.code==606){
            callNotification("error","照片过大，请上传1M以下的照片");
            fileList=fileList.map(item=>{
                if(item.uid==file.uid){
                    item.status="error";
                }
                return item;
            })
        }else if (file.status == "done") {
            this.props.onChange(file.response.data);
        }
        this.setState({ fileList })
    }

    render() {
        console.log("file list in porps", this.props.fileList);

        const { alterInfo, max, type } = this.props;
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        return (
            <div className="clearfix">
                {type == "display" ?
                    this.props.fileList != null ?
                        this.props.fileList.map((file,index) =>
                            <Upload
                                action="http://localhost:8080/savephoto"
                                listType="picture-card"
                                onPreview={this.handlePreview}
                                key={index}
                                className="display-photo"
                                // style={{display:"inline-block",width:"auto"}}
                                disabled={alterInfo ? false : true}
                                onChange={this.handleDisplayChange}
                            >
                                <img src={file.thumbUrl} alt="avatar" style={{ width: '100%' }} />
                            </Upload>
                        ) : null
                    :
                    <Upload
                        action="http://localhost:8080/savephoto"
                        listType="picture-card"
                        fileList={this.props.fileList != null ? this.props.fileList : fileList}
                        onPreview={this.handlePreview}
                        disabled={alterInfo ? false : true}
                        onChange={this.handleDisplayChange}
                    >
                        {fileList.length >= max ? null : alterInfo ? uploadButton : null}
                    </Upload>
                }
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
    onChange: PropTypes.func,
    max: PropTypes.number,
    type: PropTypes.string,
}

PictureCard.defaultProps = {
    alterInfo: true,
    max: 4,
    fileList: null,
    type: "upload"
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
