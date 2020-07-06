import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { OPEN_ACCESS_ID, CLOSED_ACCESS_ID } from '../config';
import { withStyles } from '@material-ui/core/styles';

export class FileUploadAccessSelector extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        value: PropTypes.any,
        classes: PropTypes.object,
        autoFocus: PropTypes.bool,
        fileUploadAccessSelectorId: PropTypes.string,
    };

    static defaultProps = {
        locale: {
            initialValue: 'Select access conditions',
            accessSelectOptionsText: {
                [OPEN_ACCESS_ID]: 'Open Access',
                [CLOSED_ACCESS_ID]: 'Closed Access',
            },
            errorMessage: 'This field is required',
        },
        value: '',
    };

    _onChange = event => {
        !!this.props.onChange && this.props.onChange(event.target.value);
    };

    render() {
        const { accessSelectOptionsText, errorMessage, initialValue } = this.props.locale;
        const { value, disabled, classes, autoFocus } = this.props;
        const accessOptions = [OPEN_ACCESS_ID, CLOSED_ACCESS_ID].map((access, index) => (
            <MenuItem value={parseInt(access, 10)} key={`access_option_key_${index}`}>
                {accessSelectOptionsText[access]}
            </MenuItem>
        ));

        return (
            <FormControl required {...(!value ? { error: true } : {})} fullWidth>
                <Select
                    className={classes.selector}
                    onChange={this._onChange}
                    disabled={disabled}
                    value={value}
                    displayEmpty
                    input={
                        <Input
                            name="accessCondition"
                            id="access-condition"
                            disableUnderline
                            autoFocus={autoFocus}
                            classes={{ root: !!value ? classes.selected : classes.placeholder }}
                        />
                    }
                    SelectDisplayProps={{
                        id: `${this.props.fileUploadAccessSelectorId}-select`,
                        'data-testid': `${this.props.fileUploadAccessSelectorId}-select`,
                    }}
                    MenuProps={{
                        id: `${this.props.fileUploadAccessSelectorId}-options`,
                        'data-testid': `${this.props.fileUploadAccessSelectorId}-options`,
                    }}
                    inputProps={{
                        id: `${this.props.fileUploadAccessSelectorId}-input`,
                        'data-testid': `${this.props.fileUploadAccessSelectorId}-input`,
                    }}
                >
                    <MenuItem value="" disabled>
                        {initialValue}
                    </MenuItem>
                    {accessOptions}
                </Select>
                {!value && <FormHelperText className={classes.error}>{errorMessage}</FormHelperText>}
            </FormControl>
        );
    }
}

const styles = () => ({
    selector: {
        maxWidth: 200,
        fontSize: 14,
    },
    placeholder: {
        color: 'rgba(0, 0, 0, 0.5)',
    },
    selected: {
        fontWeight: 400,
    },
    error: {
        marginTop: 0,
        fontSize: 10,
    },
});
export default withStyles(styles)(FileUploadAccessSelector);
