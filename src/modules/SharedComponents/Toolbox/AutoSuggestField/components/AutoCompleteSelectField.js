import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';

/* c8 ignore next */
const styles = theme => ({
    popper: {
        [theme.breakpoints.down('sm')]: {
            width: 'fit-content',
        },
    },
});

export const AutoCompleteSelectField = ({
    allowFreeText,
    autoCompleteSelectFieldId,
    clearable,
    defaultValue,
    disabled,
    error,
    errorText,
    floatingLabelText,
    getOptionLabel,
    itemsList,
    onChange,
    onClear,
    required,
    fullWidth = false,
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
            } else if (!!event && event.type === 'click' && reason === 'clear') {
                onClear?.();
            } else if (!value && reason === 'input') {
                onClear?.();
            }
        },
        [allowFreeText, onChange, onClear],
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

    const PopperMy = props => <Popper {...props} style={styles.popper} placement="bottom-start" />;

    return (
        <Autocomplete
            id={autoCompleteSelectFieldId}
            open={open}
            clearOnEscape
            disableClearable={!clearable}
            openOnFocus
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
            isOptionEqualToValue={(option, value) => option.value === value.value}
            options={options}
            popupIcon={false}
            disabled={disabled}
            renderInput={params => (
                <TextField
                    variant="standard"
                    {...params}
                    error={error}
                    helperText={(error && errorText) || ''}
                    fullWidth
                    label={floatingLabelText}
                    value={inputValue}
                    onChange={handleSearchTextChange}
                    required={required}
                    slotProps={{
                        htmlInput: {
                            ...params.inputProps,
                            id: `${autoCompleteSelectFieldId}-input`,
                            'data-analyticsid': `${autoCompleteSelectFieldId}-input`,
                            'data-testid': `${autoCompleteSelectFieldId}-input`,
                        },

                        inputLabel: {
                            'data-testid': `${autoCompleteSelectFieldId}-label`,
                        },
                    }}
                />
            )}
            {...((!!allowFreeText && { freeSolo: true }) || {})}
            {...(fullWidth && { fullWidth })}
            slots={{
                popper: PopperMy,
            }}
            slotProps={{
                listbox: {
                    id: `${autoCompleteSelectFieldId}-options`,
                    'data-analyticsid': `${autoCompleteSelectFieldId}-options`,
                    'data-testid': `${autoCompleteSelectFieldId}-options`,
                },
            }}
        />
    );
};

AutoCompleteSelectField.propTypes = {
    allowFreeText: PropTypes.bool,
    autoCompleteSelectFieldId: PropTypes.string.isRequired,
    clearable: PropTypes.bool,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    errorText: PropTypes.string,
    floatingLabelText: PropTypes.string,
    getOptionLabel: PropTypes.func.isRequired,
    itemsList: PropTypes.array,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    required: PropTypes.bool,
    fullWidth: PropTypes.bool,
};

export default React.memo(AutoCompleteSelectField);
