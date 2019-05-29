import React from 'react';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
// import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';

import PropTypes from 'prop-types';
import propFilter from '../../helpers/_filterProps';
import InputLabel from '@material-ui/core/InputLabel';

const SelectFieldWrapper = props => {
    const filteredProps = propFilter({...props, forceError: true}, Select.propTypes);
    filteredProps.onChange = (event) => props.input.onChange(event.target.value);
    filteredProps.onBlur = () => props.input.onBlur(props.input.value);
    const error = !!filteredProps.errorText || !!filteredProps.error;
    const helperText = filteredProps.errorText || filteredProps.error || null;
    delete filteredProps.errorText;
    return (
        <React.Fragment>
            <FormControl error={error} style={{width: '100%'}} required={filteredProps.required}>
                <InputLabel id={`${filteredProps.label}-label`}>{filteredProps.label}</InputLabel>
                <Select
                    id={`${filteredProps.label}`}
                    inputProps={{'aria-labelledby': `${filteredProps.label}-label`, id: filteredProps.label}}
                    inputLabelProps={{for: filteredProps.label, id: `${filteredProps.label}-label`}}
                    {...filteredProps}
                    autoWidth
                />
                {
                    helperText &&
                    <FormHelperText>{helperText}</FormHelperText>
                }
            </FormControl>
        </React.Fragment>
    );
};

SelectFieldWrapper.propTypes = {
    ...Select.propTypes,
    help: PropTypes.shape({
        title: PropTypes.string,
        text: PropTypes.any,
        buttonLabel: PropTypes.string
    })
};

export default SelectFieldWrapper;
