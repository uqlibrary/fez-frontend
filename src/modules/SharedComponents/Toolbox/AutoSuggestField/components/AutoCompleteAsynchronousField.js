import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'throttle-debounce';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

export const AutoCompleteAsynchronousField = ({
    allowFreeText,
    autoCompleteAsynchronousFieldId,
    clearSuggestions,
    clearOnInputClear,
    defaultValue,
    disabled,
    error,
    errorText,
    filterOptions,
    floatingLabelText,
    getOptionLabel,
    hideLabel,
    itemsList,
    itemsLoading,
    loadSuggestions,
    name,
    onChange,
    onClear,
    OptionTemplate,
    placeholder,
    prefilledSearch,
    required,
    supplemental,
    groupBy,
    clearSuggestionsOnClose = true,
    fullWidth = false,
}) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState(defaultValue);
    const active = useRef(true);

    useEffect(() => {
        // default value may not be ready when the component renders
        // so update value whenever the id changes
        if (!prefilledSearch) {
            // set new value.
            // if defaultValue is an object, we need to check if it has a value property
            // and if it does, we need to set the value property to the new value.
            // defaultValue can sometimes be {value: {value: 'value'}}, which we need
            // to detect and correctly extract the value property.
            let spreadValue;
            if (defaultValue?.value?.hasOwnProperty?.('value')) spreadValue = defaultValue.value.value;
            else {
                /* istanbul ignore else */
                if (defaultValue?.hasOwnProperty?.('value')) {
                    spreadValue = defaultValue.value;
                }
            }

            const newValue =
                defaultValue && typeof defaultValue === 'object'
                    ? {
                          ...defaultValue,
                          ...(spreadValue && { value: spreadValue }),
                      }
                    : defaultValue;

            setValue(newValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValue), prefilledSearch]);

    const loading = itemsLoading;
    const throttledLoadSuggestions = useRef(throttle(1000, newValue => loadSuggestions(newValue)));

    const handleSearchTextChange = useCallback(event => {
        setInputValue(event.target.value);
    }, []);

    const handleInputChange = useCallback(
        (event, newInputValue, reason) => {
            /* istanbul ignore next */
            if (reason === 'reset' && prefilledSearch && !!newInputValue) {
                // TBD if this block is still required
                setInputValue(newInputValue);
                setOpen(true);
            }
            if (!!event && event.type === 'click' && reason === 'clear') {
                onClear();
            } else if (!!allowFreeText && !!newInputValue && reason === 'input') {
                onChange({ value: newInputValue });
            } else if (!newInputValue && clearOnInputClear && reason === 'input') {
                onClear();
            }
        },
        [allowFreeText, prefilledSearch, onChange, onClear, clearOnInputClear],
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
        if (!open && clearSuggestionsOnClose) {
            setOptions([]);
        }
    }, [open, clearSuggestionsOnClose]);

    return (
        <React.Fragment>
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
                isOptionEqualToValue={(option, value) => option?.value === value?.value || option === value}
                getOptionLabel={getOptionLabel}
                options={options}
                loading={loading}
                popupIcon={false}
                value={value}
                renderInput={params => (
                    <TextField
                        variant="standard"
                        {...params}
                        name={name || autoCompleteAsynchronousFieldId}
                        error={error}
                        placeholder={placeholder}
                        helperText={(error && errorText) || ''}
                        fullWidth
                        label={!hideLabel && floatingLabelText}
                        value={inputValue}
                        onChange={handleSearchTextChange}
                        required={required}
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ? (
                                            <CircularProgress
                                                color="inherit"
                                                size={20}
                                                id="loading-suggestions"
                                                data-testid="loading-suggestions"
                                            />
                                        ) : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            },

                            htmlInput: {
                                ...params.inputProps,
                                'data-analyticsid': `${autoCompleteAsynchronousFieldId}-input`,
                                'data-testid': `${autoCompleteAsynchronousFieldId}-input`,
                            },

                            formHelperText: {
                                'data-testid': `${autoCompleteAsynchronousFieldId}-helper-text`,
                            },
                        }}
                    />
                )}
                {...(fullWidth && { fullWidth })}
                {...((!!allowFreeText && { freeSolo: true }) || {})}
                {...(groupBy && { groupBy })}
                {...((!!OptionTemplate && {
                    renderOption: (props, option) => {
                        return (
                            <li
                                {...props}
                                key={
                                    option.id ??
                                    option.key ??
                                    // eslint-disable-next-line react/prop-types
                                    props.id ??
                                    // eslint-disable-next-line react/prop-types
                                    /* istanbul ignore next */ props.key ??
                                    /* istanbul ignore next */ ''
                                }
                            >
                                <OptionTemplate option={option} />
                            </li>
                        );
                    },
                }) ||
                    {})}
                slotProps={{
                    listbox: {
                        id: `${autoCompleteAsynchronousFieldId}-options`,
                        'data-analyticsid': `${autoCompleteAsynchronousFieldId}-options`,
                        'data-testid': `${autoCompleteAsynchronousFieldId}-options`,
                    },
                }}
            />
            {!!supplemental && <div style={{ marginTop: '0.5rem' }}>{supplemental}</div>}
        </React.Fragment>
    );
};

AutoCompleteAsynchronousField.propTypes = {
    allowFreeText: PropTypes.bool,
    autoCompleteAsynchronousFieldId: PropTypes.string.isRequired,
    clearSuggestions: PropTypes.func,
    clearOnInputClear: PropTypes.bool,
    defaultValue: PropTypes.any,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    errorText: PropTypes.string,
    filterOptions: PropTypes.func.isRequired,
    floatingLabelText: PropTypes.string,
    getOptionLabel: PropTypes.func.isRequired,
    hideLabel: PropTypes.bool,
    itemsList: PropTypes.array,
    itemsLoading: PropTypes.bool,
    loadSuggestions: PropTypes.func,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    OptionTemplate: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    placeholder: PropTypes.string,
    prefilledSearch: PropTypes.bool,
    required: PropTypes.bool,
    supplemental: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    groupBy: PropTypes.func,
    clearSuggestionsOnClose: PropTypes.bool,
    fullWidth: PropTypes.bool,
};

export default React.memo(AutoCompleteAsynchronousField);
