import React from "react";
import { Modal ,Icon, Button} from "antd";
import PropTypes from "prop-types";
import "./style.css";

class PictureDisplay extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
    }
    handlePreview = () => {
        this.setState({
            previewImage: `data:image/png;base64,${this.props.photo}`,
            previewVisible: true,
        });
    };

    render() {
        const { previewVisible, previewImage } = this.state;
        const { photo } = this.props;
        return (
            <span>
                <img
                    style={{ width: "70px" }}
                    className="img"
                    onClick={this.handlePreview}
                    src={`data:image/png;base64,${photo}`} />
                <Modal 
                visible={previewVisible} 
                footer={[<Button key="1"><a href={`data:image/png;base64,${this.props.photo}`} download={`${new Date().getTime()}.jpg`}>下载</a></Button>]} 
                onCancel={() => this.setState({ previewVisible: false })}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </span>
        )
    }
}

PictureDisplay.propTypes = {
    photo: PropTypes.string.isRequired,
}

export default PictureDisplay;