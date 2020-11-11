import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import { FILE_ACCESS_CONDITION_OPEN, FILE_ACCESS_CONDITION_CLOSED } from '../config';
import { withStyles } from '@material-ui/core/styles';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';

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
            selectPrompt: 'Select access conditions',
            options: [
                { text: 'Open access', value: FILE_ACCESS_CONDITION_OPEN },
                { text: 'Closed access', value: FILE_ACCESS_CONDITION_CLOSED },
            ],
            errorMessage: 'This field is required',
        },
        value: '',
    };

    handleChange = value => !!this.props.onChange && this.props.onChange(value);

    render() {
        const { errorMessage, selectPrompt, options } = this.props.locale;
        const { value, disabled, classes, autoFocus } = this.props;

        return (
            <NewGenericSelectField
                disabled={disabled}
                error={!value}
                errorText={errorMessage}
                genericSelectFieldId={this.props.fileUploadAccessSelectorId}
                onChange={this.handleChange}
                value={value || -1}
                itemsList={options}
                selectPrompt={selectPrompt}
                selectProps={{
                    className: classes.selector,
                    input: (
                        <Input
                            disableUnderline
                            autoFocus={autoFocus}
                            classes={{ root: !!value ? classes.selected : classes.placeholder }}
                        />
                    ),
                }}
                formHelperTextProps={{
                    className: classes.error,
                }}
                hideLabel
                required
            />
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
