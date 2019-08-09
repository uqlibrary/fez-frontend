import React, { Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

import propFilter from '../../helpers/_filterProps';
import { withStyles } from '@material-ui/core/styles';

const styles = {};

export const TextFieldWrapper = props => {
    const filteredProps = propFilter({ ...props, forceError: true }, TextField.propTypes);
    // Assign the redux validation error to the MUI input error prop and remove it from the prop payload
    const helperText = filteredProps.errorText || undefined;
    const hideLabel = !!filteredProps.hideLabel;
    delete filteredProps.errorText;
    delete filteredProps.hideLabel;
    const ariaLabel = `${filteredProps.id || filteredProps.label && filteredProps.label.replace(/\s+/g, '')}`.toString();
    return (
        <Fragment>
            <TextField {...filteredProps}
                helperText={helperText}
                id={ariaLabel}
                inputProps={{
                    id: ariaLabel,
                    label: filteredProps.label,
                    'aria-label': filteredProps.label,
                    'aria-labelledby': `${ariaLabel}-label`,
                }}
                InputLabelProps={{
                    shrink: filteredProps.floatinglabelfixed ? true : undefined,
                    id: `${ariaLabel}-label`,
                    htmlFor: ariaLabel,
                    hidden: hideLabel,
                }}
            />
        </Fragment>
    );
};

TextFieldWrapper.propTypes = {
    ...TextField.propTypes,
    help: PropTypes.shape({
        title: PropTypes.string,
        text: PropTypes.any,
        buttonLabel: PropTypes.string,
    }),
    classes: PropTypes.object,
};

export default withStyles(styles)(TextFieldWrapper);
