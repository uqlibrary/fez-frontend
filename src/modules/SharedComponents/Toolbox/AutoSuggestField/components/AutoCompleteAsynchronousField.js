import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'throttle-debounce';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

export const AutoCompleteAsynchronousField = ({
    allowFreeText,
    autoCompleteAsynchronousFieldId,
    clearSuggestions,
    defaultValue,
    disabled,
    error,
    errorText,
    filterOptions,
    floatingLabelText,
    hideLabel,
    getOptionLabel,
    itemsList,
    itemsLoading,
    loadSuggestions,
    onChange,
    onClear,
    OptionTemplate,
    prefilledSearch,
    required,
    placeholder,
}) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState(defaultValue);
    const active = useRef(true);

    const loading = itemsLoading;
    const throttledLoadSuggestions = useRef(throttle(1000, newValue => loadSuggestions(newValue)));

    const handleSearchTextChange = useCallback(event => {
        setInputValue(event.target.value);
    }, []);

    const handleInputChange = useCallback(
        (event, newInputValue, reason) => {
            if (reason === 'reset' && prefilledSearch && !!newInputValue) {
                setInputValue(newInputValue);
                setOpen(true);
            } else if (reason === 'clear') {
                onClear();
            } else if (!newInputValue && reason === 'input') {
                onClear();
            } else if (!!allowFreeText && !!newInputValue && reason === 'input') {
                onChange({ value: newInputValue });
            }
        },
        [allowFreeText, prefilledSearch, onChange, onClear],
    );

    const handleChange = useCallback(
        (event, newValue) => {
            setValue(newValue);
            !!newValue && onChange(newValue);
            !!clearSuggestions && clearSuggestions();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onChange],
    );

    useEffect(() => {
        if (inputValue && throttledLoadSuggestions) {
            throttledLoadSuggestions.current(inputValue);
        }
    }, [inputValue]);

    useEffect(() => {
        active.current = !loading && itemsList.length > 0;

        !!active.current && setOptions(itemsList);

        return () => {
            active.current = false;
        };
    }, [itemsList, loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);
    return (
        <Autocomplete
            id={autoCompleteAsynchronousFieldId}
            clearOnEscape
            disabled={disabled}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            onInputChange={handleInputChange}
            onChange={handleChange}
            filterOptions={filterOptions}
            getOptionSelected={(option, value) => option.value === value.value}
            getOptionLabel={getOptionLabel}
            options={options}
            loading={loading}
            popupIcon={false}
            value={value}
            renderInput={params => (
                <TextField
                    {...params}
                    error={error}
                    placeholder={placeholder}
                    helperText={(error && errorText) || ''}
                    fullWidth
                    label={!hideLabel && floatingLabelText}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? (
                                    <CircularProgress color="inherit" size={20} id="loading-suggestions" />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                    inputProps={{
                        ...params.inputProps,
                        id: `${autoCompleteAsynchronousFieldId}-input`,
                        'data-testid': `${autoCompleteAsynchronousFieldId}-input`,
                    }}
                    value={inputValue}
                    onChange={handleSearchTextChange}
                    required={required}
                />
            )}
            ListboxProps={{
                id: `${autoCompleteAsynchronousFieldId}-options`,
                'data-testid': `${autoCompleteAsynchronousFieldId}-options`,
            }}
            {...((!!allowFreeText && { freeSolo: true }) || {})}
            {...((!!OptionTemplate && { renderOption: option => <OptionTemplate option={option} /> }) || {})}
        />
    );
};

AutoCompleteAsynchronousField.propTypes = {
    allowFreeText: PropTypes.bool,
    autoCompleteAsynchronousFieldId: PropTypes.string.isRequired,
    clearSuggestions: PropTypes.func,
    defaultValue: PropTypes.any,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    errorText: PropTypes.string,
    filterOptions: PropTypes.func.isRequired,
    floatingLabelText: PropTypes.string,
    placeholder: PropTypes.string,
    getOptionLabel: PropTypes.func.isRequired,
    itemsList: PropTypes.array,
    itemsLoading: PropTypes.bool,
    loadSuggestions: PropTypes.func,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    OptionTemplate: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    prefilledSearch: PropTypes.bool,
    required: PropTypes.bool,
    hideLabel: PropTypes.bool,
};

export default React.memo(AutoCompleteAsynchronousField);
