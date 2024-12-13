import React, { forwardRef } from 'react';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
// import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';

import PropTypes from 'prop-types';
import propFilter from '../../helpers/_filterProps';
import InputLabel from '@mui/material/InputLabel';

const SelectFieldWrapper = forwardRef((props, ref) => {
    const filteredProps = propFilter({ ...props, forceError: true }, Select.propTypes);
    filteredProps.value = filteredProps.value ?? '';
    filteredProps.onChange = event => props.input.onChange(event.target.value);
    filteredProps.onBlur = () => props.input.onBlur(props.input.value);
    const error = !!filteredProps.errorText || !!filteredProps.error;
    const helperText = filteredProps.errorText || filteredProps.error || null;
    const hideLabel = !!filteredProps.hideLabel;
    const formHelperTextProps = filteredProps.formHelperTextProps ?? {};
    delete filteredProps.formHelperTextProps;
    delete filteredProps.hideLabel;
    delete filteredProps.errorText;

    return (
        <React.Fragment>
            <FormControl variant="standard" error={error} style={{ width: '100%' }} required={filteredProps.required}>
                {!hideLabel && <InputLabel id={`${props.selectFieldId}-label`}>{filteredProps.label}</InputLabel>}
                <Select
                    ref={ref}
                    variant="standard"
                    inputProps={{
                        'aria-labelledby': `${props.selectFieldId}-label`,
                        'data-analyticsid': `${props.selectFieldId}-input`,
                        'data-testid': `${props.selectFieldId}-input`,
                        id: `${props.selectFieldId}-input`,
                    }}
                    SelectDisplayProps={{
                        id: `${props.selectFieldId}-select`,
                        'data-testid': `${props.selectFieldId}-select`,
                    }}
                    MenuProps={{
                        id: `${props.selectFieldId}-options`,
                        'data-analyticsid': `${props.selectFieldId}-options`,
                        'data-testid': `${props.selectFieldId}-options`,
                    }}
                    {...filteredProps}
                    autoWidth
                />
                {helperText && <FormHelperText {...formHelperTextProps}>{helperText}</FormHelperText>}
            </FormControl>
        </React.Fragment>
    );
});

SelectFieldWrapper.propTypes = {
    ...Select.propTypes,
    input: PropTypes.object,
    selectFieldId: PropTypes.string.isRequired,
    hideLabel: PropTypes.bool,
    formHelperTextProps: PropTypes.object,
    help: PropTypes.shape({
        title: PropTypes.string,
        text: PropTypes.any,
        buttonLabel: PropTypes.string,
    }),
};

export default SelectFieldWrapper;
