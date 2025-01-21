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
}) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState(defaultValue || null);
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
            } else if (!!event && event.type === 'click' && reason === 'clear') {
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
        if (!open) {
            setOptions([]);
        }
    }, [open]);

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
                isOptionEqualToValue={(option, value) => option.value === value.value}
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
                        FormHelperTextProps={{
                            'data-testid': `${autoCompleteAsynchronousFieldId}-helper-text`,
                        }}
                        fullWidth
                        label={!hideLabel && floatingLabelText}
                        InputProps={{
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
                        }}
                        inputProps={{
                            ...params.inputProps,
                            'data-analyticsid': `${autoCompleteAsynchronousFieldId}-input`,
                            'data-testid': `${autoCompleteAsynchronousFieldId}-input`,
                        }}
                        value={inputValue}
                        onChange={handleSearchTextChange}
                        required={required}
                    />
                )}
                ListboxProps={{
                    id: `${autoCompleteAsynchronousFieldId}-options`,
                    'data-analyticsid': `${autoCompleteAsynchronousFieldId}-options`,
                    'data-testid': `${autoCompleteAsynchronousFieldId}-options`,
                }}
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
};

export default React.memo(AutoCompleteAsynchronousField);
