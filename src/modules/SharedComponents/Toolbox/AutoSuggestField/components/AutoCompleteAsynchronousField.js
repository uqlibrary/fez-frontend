import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'throttle-debounce';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

export const AutoCompleteAsynchronousField = ({
    allowFreeText,
    defaultValue,
    disabled,
    error,
    errorText,
    filterOptions,
    floatingLabelText,
    getOptionLabel,
    id,
    itemsList,
    itemsLoading,
    loadSuggestions,
    onChange,
    onClear,
    OptionTemplate,
    required,
}) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState(defaultValue);

    const loading = itemsLoading;
    const throttledLoadSuggestions = React.useMemo(() => throttle(1000, loadSuggestions), [loadSuggestions]);

    const handleSearchTextChange = useCallback(event => {
        setInputValue(event.target.value);
    }, []);

    const handleInputChange = useCallback(
        (event, value, reason) => {
            if (reason === 'clear') {
                onClear();
            } else if (!value && reason === 'input') {
                onClear();
            } else if (!!allowFreeText && !!value && reason === 'input') {
                onChange({ value });
            }
        },
        [allowFreeText, onChange, onClear],
    );

    const handleChange = useCallback(
        (event, newValue) => {
            setValue(newValue);
            !!newValue && onChange(newValue);
        },
        [onChange],
    );

    useEffect(() => {
        if (inputValue && throttledLoadSuggestions) {
            throttledLoadSuggestions(inputValue);
        }
    }, [inputValue, throttledLoadSuggestions]);

    useEffect(() => {
        let active = true;

        if (!loading && itemsList.length === 0) {
            return undefined;
        }

        !!active && setOptions(itemsList);

        return () => {
            active = false;
        };
    }, [itemsList, loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <Autocomplete
            id={id}
            clearOnEscape
            disabled={disabled}
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
                    helperText={(error && errorText) || ''}
                    fullWidth
                    label={floatingLabelText}
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
                    value={inputValue}
                    onChange={handleSearchTextChange}
                    required={required}
                />
            )}
            {...((!!allowFreeText && { freeSolo: true }) || {})}
            {...((!!OptionTemplate && { renderOption: option => <OptionTemplate option={option} /> }) || {})}
        />
    );
};

AutoCompleteAsynchronousField.propTypes = {
    allowFreeText: PropTypes.bool,
    defaultValue: PropTypes.any,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    errorText: PropTypes.string,
    filterOptions: PropTypes.func.isRequired,
    floatingLabelText: PropTypes.string,
    getOptionLabel: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    itemsList: PropTypes.array,
    itemsLoading: PropTypes.bool,
    loadSuggestions: PropTypes.func,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    OptionTemplate: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    required: PropTypes.bool,
};

export default React.memo(AutoCompleteAsynchronousField);
