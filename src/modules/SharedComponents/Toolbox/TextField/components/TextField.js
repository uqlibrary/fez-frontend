import React, { Fragment } from 'react';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

import propFilter from '../../helpers/_filterProps';

export const TextFieldWrapper = React.forwardRef((props, ref) => {
    const filteredProps = propFilter({ ...props, forceError: true }, TextField.propTypes);
    // Assign the redux validation error to the MUI input error prop and remove it from the prop payload
    const helperText = filteredProps.errorText || undefined;
    const hideLabel = !!filteredProps.hideLabel;
    const id = props.textFieldId ?? props.name ?? props.id;

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
                id={id}
                data-testid={id}
                FormHelperTextProps={{
                    'data-testid': `${id}-helper-text`,
                }}
                inputProps={{
                    id: `${id}-input`,
                    'data-analyticsid': `${id}-input`,
                    'data-testid': `${id}-input`,
                    label: filteredProps.label,
                    'aria-label': props.ariaLabel || filteredProps.label,
                    ...(props.ariaLabelledby && { 'aria-labelledby': props.ariaLabelledby }),
                    ...filteredProps.inputProps,
                }}
                InputLabelProps={{
                    shrink: filteredProps.floatinglabelfixed ? true : undefined,
                    id: `${id}-label`,
                    'data-testid': `${id}-label`,
                    htmlFor: `${id}-input`,
                    hidden: hideLabel,
                    ...filteredProps.InputLabelProps,
                }}
            />
        </Fragment>
    );
});

TextFieldWrapper.propTypes = {
    ...TextField.propTypes,
    textFieldId: PropTypes.string,
    help: PropTypes.shape({
        title: PropTypes.string,
        text: PropTypes.any,
        buttonLabel: PropTypes.string,
    }),
};

TextFieldWrapper.displayName = 'TextField';

export default TextFieldWrapper;
