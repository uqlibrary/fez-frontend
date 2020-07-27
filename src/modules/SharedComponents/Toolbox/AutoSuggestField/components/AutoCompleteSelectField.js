import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export const AutoCompleteSelectField = ({
    allowFreeText,
    autoCompleteSelectFieldId,
    defaultValue,
    disabled,
    error,
    errorText,
    floatingLabelText,
    getOptionLabel,
    itemsList,
    onChange,
    required,
}) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState(itemsList);
    const [inputValue, setInputValue] = useState('');
    const [value] = useState(defaultValue);

    const handleSearchTextChange = useCallback(event => {
        setInputValue(event.target.value);
    }, []);

    const handleInputChange = useCallback(
        (event, value, reason) => {
            if (!!allowFreeText && !!value && reason === 'input') {
                onChange({ value });
            }
        },
        [allowFreeText, onChange],
    );

    const handleChange = useCallback(
        (event, value) => {
            !!value && onChange(value);
        },
        [onChange],
    );

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        } else {
            setOptions(itemsList);
        }
    }, [itemsList, open]);

    return (
        <Autocomplete
            id={autoCompleteSelectFieldId}
            open={open}
            clearOnEscape
            disableClearable
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            value={value}
            onInputChange={handleInputChange}
            onChange={handleChange}
            getOptionLabel={getOptionLabel}
            options={options}
            popupIcon={false}
            disabled={disabled}
            renderInput={params => (
                <TextField
                    {...params}
                    error={error}
                    helperText={(error && errorText) || ''}
                    fullWidth
                    label={floatingLabelText}
                    value={inputValue}
                    onChange={handleSearchTextChange}
                    required={required}
                    inputProps={{
                        ...params.inputProps,
                        id: `${autoCompleteSelectFieldId}-input`,
                        'data-testid': `${autoCompleteSelectFieldId}-input`,
                    }}
                />
            )}
            ListboxProps={{
                id: `${autoCompleteSelectFieldId}-options`,
                'data-testid': `${autoCompleteSelectFieldId}-options`,
            }}
            {...((!!allowFreeText && { freeSolo: true }) || {})}
        />
    );
};

AutoCompleteSelectField.propTypes = {
    allowFreeText: PropTypes.bool,
    autoCompleteSelectFieldId: PropTypes.string.isRequired,
    defaultValue: PropTypes.object,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    errorText: PropTypes.string,
    floatingLabelText: PropTypes.string,
    getOptionLabel: PropTypes.func.isRequired,
    itemsList: PropTypes.array,
    onChange: PropTypes.func,
    required: PropTypes.bool,
};

export default React.memo(AutoCompleteSelectField);
