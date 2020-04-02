import React from "react";
import CheckableTag from "../CheckableTag";
import PropTypes from "prop-types";
import { Tag, Icon, Input } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as articleActions, getByTags, getTags } from "../../redux/modules/article";
import {callMessage}from "../../utils/commonUtils";

class TagsSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputVisible: false,
            inputValue: '',
        }
    }


    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    handleTagClick = (uid) => {
        const { value } = this.props;
        let updateValue = new Array();
        if (value.indexOf(uid) == -1) {
            updateValue = value.concat([uid]);
        } else {
            updateValue = value.filter(item => item != uid);
        }
        this.triggerChange(updateValue);
    }

    triggerChange = changedValue => {
        const { onChange, value } = this.props;
        console.log("value", value);

        if (onChange) {
            onChange(changedValue);
        }
    };

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    handleInputConfirm = () => {
        const { inputValue } = this.state;
        if (inputValue == "" || inputValue == undefined || inputValue == null) {
            this.setState({
                inputVisible: false,
                inputValue: '',
            });
            return;
        }
        this.props.addTag(inputValue)
            .then(() => {
                callMessage("success", "新增标签成功")
                this.setState({
                    inputVisible: false,
                    inputValue: '',
                });
            })
            .catch(err => {
                callMessage("error", "新增标签失败")
            });
    };

    componentDidMount() {
        this.props.fetchTags();
    }

    saveInputRef = input => (this.input = input);

    render() {
        const { tags, byTags } = this.props;
        const { inputVisible, inputValue } = this.state;
        return (
            <div>
                {tags.map(uid => <CheckableTag key={uid} onClick={() => this.handleTagClick(uid)}>{byTags[uid].name}</CheckableTag>)}
                {inputVisible && (
                    <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        // onPressEnter={this.handleInputConfirm}
                    />
                )}
                {!inputVisible && (
                    <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                        <Icon type="plus" /> 新增标签
                    </Tag>
                )}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        tags: getTags(state),
        byTags: getByTags(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(articleActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TagsSelect);