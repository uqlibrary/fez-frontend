import React, { Fragment } from 'react';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

import propFilter from '../../helpers/_filterProps';

export const TextFieldWrapper = React.forwardRef((props, ref) => {
    const filteredProps = propFilter({ ...props, forceError: true }, TextField.propTypes);
    // Assign the redux validation error to the MUI input error prop and remove it from the prop payload
    const helperText = filteredProps.errorText || undefined;
    const hideLabel = !!filteredProps.hideLabel;
    delete filteredProps.columnDef;
    delete filteredProps.errorText;
    delete filteredProps.hideLabel;
    delete filteredProps.hintText;
    delete filteredProps.onRowDataChange;
    delete filteredProps.rowData;
    delete filteredProps.ariaLabel;
    return (
        <Fragment>
            <TextField
                variant="standard"
                {...filteredProps}
                ref={ref}
                helperText={helperText}
                id={props.textFieldId}
                inputProps={{
                    id: `${props.textFieldId}-input`,
                    'data-testid': `${props.textFieldId}-input`,
                    label: filteredProps.label,
                    'aria-label': props.ariaLabel || filteredProps.label,
                    'aria-labelledby': `${props.textFieldId}-input`,
                    ...filteredProps.inputProps,
                }}
                InputLabelProps={{
                    shrink: filteredProps.floatinglabelfixed ? true : undefined,
                    id: `${props.textFieldId}-label`,
                    'data-testid': `${props.textFieldId}-label`,
                    htmlFor: `${props.textFieldId}-input`,
                    hidden: hideLabel,
                    ...filteredProps.InputLabelProps,
                }}
            />
        </Fragment>
    );
});

TextFieldWrapper.propTypes = {
    ...TextField.propTypes,
    textFieldId: PropTypes.string.isRequired,
    help: PropTypes.shape({
        title: PropTypes.string,
        text: PropTypes.any,
        buttonLabel: PropTypes.string,
    }),
};

TextFieldWrapper.displayName = 'TextField';

export default TextFieldWrapper;
