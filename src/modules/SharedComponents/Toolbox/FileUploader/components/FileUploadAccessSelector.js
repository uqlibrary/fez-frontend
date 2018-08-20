import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Input, MenuItem, FormHelperText, FormControl, Select} from '@material-ui/core';
import {OPEN_ACCESS_ID, CLOSED_ACCESS_ID} from '../config';
import {withStyles} from '@material-ui/core/styles';

export class FileUploadAccessSelector extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        value: PropTypes.any,
        classes: PropTypes.object
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
        const {value, disabled, classes} = this.props;
        const accessOptions = [OPEN_ACCESS_ID, CLOSED_ACCESS_ID].map((access, index) => (
            <MenuItem value={parseInt(access, 10)} key={`access_option_key_${index}`}>{accessSelectOptionsText[access]}</MenuItem>
        ));

        return (
            <FormControl required {...(!value ? {error: true} : {})} fullWidth>
                <Select
                    className={classes.selector}
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

const styles = () => ({
    selector: {
        maxWidth: 200,
        fontSize: '14px',
        '&:before': {
            borderBottom: 0
        },
        '&:after': {
            borderBottom: 0
        },
        '&:hover': {
            borderBottom: 0
        }
    }
});
export default withStyles(styles)(FileUploadAccessSelector);
