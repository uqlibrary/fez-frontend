import React from 'react';
import PropTypes from 'prop-types';
import { RadioGroup, Radio, FormControl, FormControlLabel, FormHelperText, FormLabel } from '@mui/material';
import propFilter from '../../helpers/_filterProps';

const RadioGroupField = props => {
    const filteredProps = propFilter({ ...props, forceError: true });
    filteredProps.value = filteredProps.value ?? '';
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
                {!hideLabel && (
                    <FormLabel id={`${filteredProps.radioGroupFieldId}-label`}>{filteredProps.label}</FormLabel>
                )}
                <RadioGroup
                    row={filteredProps.row}
                    aria-labelledby={`${filteredProps.radioGroupFieldId}-label`}
                    name={filteredProps.name}
                    onChange={filteredProps.onChange}
                    value={filteredProps.value}
                    defaultValue={filteredProps.defaultValue}
                >
                    {filteredProps.options.map(option => (
                        <FormControlLabel
                            control={
                                <Radio
                                    inputProps={{
                                        'data-analyticsid': `${props.radioGroupFieldId}-${option.value}-option`,
                                        'data-testid': `${props.radioGroupFieldId}-${option.value}-option`,
                                        id: `${props.radioGroupFieldId}-${option.value}-option`,
                                    }}
                                />
                            }
                            key={option.value}
                            label={option.label}
                            value={option.value}
                        />
                    ))}
                </RadioGroup>
                {helperText && <FormHelperText {...formHelperTextProps}>{helperText}</FormHelperText>}
            </FormControl>
        </React.Fragment>
    );
};

RadioGroupField.propTypes = {
    options: PropTypes.array.isRequired,
    radioGroupFieldId: PropTypes.string.isRequired,
    hideLabel: PropTypes.bool,
    formHelperTextProps: PropTypes.object,
    onChange: PropTypes.func,
};

export default RadioGroupField;
