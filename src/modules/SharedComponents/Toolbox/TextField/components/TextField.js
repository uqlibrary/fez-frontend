import React, {Fragment} from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

import propFilter from '../../helpers/_filterProps';
import {withStyles} from '@material-ui/core/styles';

const styles = {};

export const TextFieldWrapper = props => {
    const filteredProps = propFilter({...props, forceError: true}, TextField.propTypes);
    // Assign the redux validation error to the MUI input error prop and remove it from the prop payload
    const helperText = filteredProps.errorText || undefined;
    delete filteredProps.errorText;
    return (
        <Fragment>
            <TextField {...filteredProps}
                helperText={helperText}
                id={props.id || props.label || ''}
                InputLabelProps={filteredProps.floatinglabelfixed ? {shrink: true} : null}
            />
        </Fragment>
    );
};

TextFieldWrapper.propTypes = {
    ...TextField.propTypes,
    help: PropTypes.shape({
        title: PropTypes.string,
        text: PropTypes.any,
        buttonLabel: PropTypes.string
    }),
    classes: PropTypes.object
};

export default withStyles(styles)(TextFieldWrapper);
