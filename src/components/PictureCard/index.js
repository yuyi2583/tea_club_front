import React from "react";
import { Upload, Modal, Icon } from "antd";
import PropTypes from "prop-types";
import { callNotification } from "../../utils/commonUtils";
import "./style.css";

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
        this.setState({
            previewImage: file.thumbUrl || file.preview,
            previewVisible: true,
        });
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handleDisplayChange = ({ file, fileList }) => {
        console.log("handle display change file",file);
        
        if (file.response != undefined && file.response.code == 606) {
            callNotification("error", "照片过大，请上传1M以下的照片");
            fileList = fileList.map(item => {
                if (item.uid == file.uid) {
                    item.status = "error";
                }
                return item;
            })
        } else if (file.status == "done") {
            this.props.onChange("done", file.response.data);
        } else if (file.status == "removed") {
            if (file.response != null || file.response != undefined) {
                this.props.onChange("removed", file.response.data);
            } else {
                this.props.onChange("removed", file);
            }
        }
        this.setState({ fileList })
    }

    componentDidUpdate(prevProps) {
        if (this.props.type != "display" && prevProps.type != this.props.type) {
            this.setState({ fileList: this.props.fileList });
        }
    }

    render() {
        const { max, type } = this.props;
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
                        this.props.fileList.map((file, index) =>
                            <Upload
                                action="http://localhost:8080/savephoto"
                                listType="picture-card"
                                onPreview={this.handlePreview}
                                key={index}
                                className="display-photo"
                                disabled={true}
                            >
                                <img src={file.thumbUrl} alt="avatar" style={{ width: '100%' }} />
                            </Upload>
                        ) : null
                    :
                    <Upload
                        action="http://localhost:8080/savephoto"
                        listType="picture-card"
                        className="upload-photo"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleDisplayChange}
                    >
                        {fileList.length >= max ? null : uploadButton }
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
    onChange: PropTypes.func,
    max: PropTypes.number,
    type: PropTypes.string,
}

PictureCard.defaultProps = {
    max: 4,
    fileList: new Array(),
    type: "upload"
}

export default PictureCard;
