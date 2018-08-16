import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Input, MenuItem, FormHelperText, FormControl, Select} from '@material-ui/core';
import {OPEN_ACCESS_ID, CLOSED_ACCESS_ID} from '../config';

export default class FileUploadAccessSelector extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        value: PropTypes.any
    };

    static defaultProps = {
        locale: {
            initialValue: 'Select access conditions',
            accessSelectOptionsText: {
                [OPEN_ACCESS_ID]: 'Open Access',
                [CLOSED_ACCESS_ID]: 'Closed Access'
            },
            errorMessage: 'This field is required'
        },
        value: ''
    };

    _onChange = (event) => {
        if (this.props.onChange) this.props.onChange(event.target.value);
    };

    render() {
        const {accessSelectOptionsText, errorMessage, initialValue} = this.props.locale;
        const {value, disabled} = this.props;
        const accessOptions = [OPEN_ACCESS_ID, CLOSED_ACCESS_ID].map((access, index) => (
            <MenuItem value={parseInt(access, 10)} key={`access_option_key_${index}`}>{accessSelectOptionsText[access]}</MenuItem>
        ));

        return (
            <FormControl {...(!value ? {error: true} : {})}>
                <Select
                    className="selectField requiredField"
                    onChange={this._onChange}
                    disabled={disabled}
                    value={value}
                    displayEmpty
                    input={<Input name="accessCondition" id="access-condition"/>}
                >
                    <MenuItem value="" disabled>{initialValue}</MenuItem>
                    {accessOptions}
                </Select>
                {
                    !value &&
                    <FormHelperText>{errorMessage}</FormHelperText>
                }
            </FormControl>
        );
    }
}
