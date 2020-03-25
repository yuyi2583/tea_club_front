import { Form, Input, Select, Button, InputNumber } from 'antd';
import PropTypes from "prop-types";
import React from "react";

const { Option } = Select;

class PriceInput extends React.Component {
    handleNumberChange = number => {
        // const number = parseInt(e.target.value || 0, 10);
        if (isNaN(number)) {
            return;
        }
        this.triggerChange({ number });
    };

    handleCurrencyChange = currency => {
        this.triggerChange({ currency });
    };

    handleOperationChange = opeartion => {
        this.triggerChange({ opeartion });
    }

    triggerChange = changedValue => {
        const { onChange, value } = this.props;
        if (onChange) {
            onChange({
                ...value,
                ...changedValue,
            });
        }
    };

    render() {
        const { value, showOperation } = this.props;
        return (
            <span>
                {
                    <Select
                        value={value.operation}
                        style={{ width: '70px' }}
                        disabled={!showOperation }
                        onChange={this.handleOperationChange}
                    >
                        <Option value="plus">赠</Option>
                        <Option value="minus">减</Option>
                    </Select> }
                <InputNumber
                    value={value.number}
                    min={0}
                    onChange={this.handleNumberChange}
                    style={{ width: '70px', margin: '0 5px' }}
                />
                <Select
                    value={value.currency}
                    style={{ width: '70px' }}
                    onChange={this.handleCurrencyChange}
                >
                    <Option value="ingot">元宝</Option>
                    <Option value="credit">积分</Option>
                </Select>
            </span>
        );
    }
}

PriceInput.propTypes = {
    showOperation: PropTypes.bool
}

PriceInput.defaultProps = {
    showOperation: true
}

export default PriceInput;

