import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

import {OPEN_ACCESS_ID, CLOSED_ACCESS_ID} from '../config';

export default class FileUploadAccessSelector extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        value: PropTypes.number
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
        value: null
    };

    _onChange = (event, index, value) => {
        if (this.props.onChange) this.props.onChange(value);
    };

    render() {
        const {initialValue, accessSelectOptionsText, errorMessage} = this.props.locale;
        const {value, disabled} = this.props;
        const accessOptions = [OPEN_ACCESS_ID, CLOSED_ACCESS_ID].map((access, index) => (
            <MenuItem value={parseInt(access, 10)} primaryText={accessSelectOptionsText[access]} key={`access_option_key_${index}`} />
        ));

        return (
            <SelectField
                id={'accessCondition'}
                className="selectField requiredField"
                hintText={initialValue}
                dropDownMenuProps={{animated: false}}
                maxHeight={250}
                onChange={this._onChange}
                errorText={!value ? errorMessage : ''}
                floatingLabelFixed
                disabled={disabled}
                value={value}>
                {accessOptions}
            </SelectField>
        );
    }
}
