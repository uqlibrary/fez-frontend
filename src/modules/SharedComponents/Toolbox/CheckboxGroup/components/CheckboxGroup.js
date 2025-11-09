import React from 'react';
import PropTypes from 'prop-types';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    TextField,
    Box,
} from '@mui/material';
import propFilter from '../../helpers/_filterProps';

const CheckboxGroup = props => {
    const filteredProps = propFilter({ ...props, forceError: true });
    filteredProps.value = filteredProps.value || {};
    const error = !!filteredProps.errorText || !!filteredProps.error;
    const helperText = filteredProps.errorText || filteredProps.error || null;
    const hideLabel = !!filteredProps.hideLabel;
    const formHelperTextProps = filteredProps.formHelperTextProps ?? {};
    delete filteredProps.formHelperTextProps;
    delete filteredProps.hideLabel;
    delete filteredProps.errorText;

    /**
     * Manage selected values in an array
     * @param value
     * @param key
     * @param isTextField
     */
    const handleChange = (value, key, isTextField = false) => {
        const newValues = { ...filteredProps.value };
        if (newValues.hasOwnProperty(key) && (!isTextField || !value)) {
            delete newValues[key];
        } else {
            newValues[key] = value;
        }

        // overwrite existing array with newValues
        props.onChange(newValues);
    };

    return (
        <React.Fragment>
            <FormControl variant="standard" error={error} style={{ width: '100%' }} required={filteredProps.required}>
                {!hideLabel && <FormLabel id={`${props.checkboxGroupId}-label`}>{filteredProps.label}</FormLabel>}
                <FormGroup row={filteredProps.row}>
                    {props.options.map(option => (
                        <Box key={`${option.value}-parent`}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={filteredProps.value.hasOwnProperty(option.value)}
                                        label={option.label}
                                        inputProps={{
                                            'data-analyticsid': `${props.checkboxGroupId}-${option.value}-option`,
                                            'data-testid': `${props.checkboxGroupId}-${option.value}-option`,
                                            id: `${props.checkboxGroupId}-${option.value}-option`,
                                        }}
                                        onChange={() => handleChange(option.value, option.value)}
                                    />
                                }
                                label={option.label}
                                key={option.value}
                            />
                            {option.appendTextField && (
                                <TextField
                                    variant={'standard'}
                                    name={`${option.value}-text`}
                                    key={`${option.value}-text`}
                                    value={
                                        filteredProps.value.hasOwnProperty(`${option.value}Text`)
                                            ? filteredProps.value[`${option.value}Text`]
                                            : ''
                                    }
                                    onChange={e => handleChange(e.target.value, `${option.value}Text`, true)}
                                    slotProps={{
                                        htmlInput: {
                                            'data-analyticsid': `${props.checkboxGroupId}-${option.value}-option-text`,
                                            'data-testid': `${props.checkboxGroupId}-${option.value}-option-text`,
                                            id: `${props.checkboxGroupId}-${option.value}-option-text`,
                                        },
                                    }}
                                />
                            )}
                        </Box>
                    ))}
                </FormGroup>
                {helperText && <FormHelperText {...formHelperTextProps}>{helperText}</FormHelperText>}
            </FormControl>
        </React.Fragment>
    );
};

CheckboxGroup.propTypes = {
    options: PropTypes.array.isRequired,
    checkboxGroupId: PropTypes.string.isRequired,
    hideLabel: PropTypes.bool,
    row: PropTypes.bool,
    formHelperTextProps: PropTypes.object,
    onChange: PropTypes.func,
};

export default CheckboxGroup;
