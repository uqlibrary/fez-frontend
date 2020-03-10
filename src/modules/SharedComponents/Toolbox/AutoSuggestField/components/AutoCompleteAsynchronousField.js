import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'throttle-debounce';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

export const AutoCompleteAsynchronousField = ({
    error,
    errorText,
    filterOptions,
    floatingLabelText,
    getOptionLabel,
    id,
    itemsList,
    loadSuggestions,
    onChange,
    onClear,
    OptionTemplate,
    required,
}) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const loading = open && options.length === 0;
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
            }
        },
        [onClear],
    );

    const handleChange = useCallback(
        (event, value) => {
            !!value && onChange(value);
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

        if (!loading) {
            return undefined;
        }

        if (active) {
            setOptions(itemsList);
        }

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
            id={id || 'auto-complete-asynchronous-field'}
            open={open}
            clearOnEscape
            disableOpenOnFocus
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
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                    value={inputValue}
                    onChange={handleSearchTextChange}
                    required={required}
                />
            )}
            renderOption={option => <OptionTemplate option={option} />}
        />
    );
};

AutoCompleteAsynchronousField.propTypes = {
    error: PropTypes.bool,
    errorText: PropTypes.string,
    filterOptions: PropTypes.func.isRequired,
    floatingLabelText: PropTypes.string,
    getOptionLabel: PropTypes.func.isRequired,
    id: PropTypes.string,
    itemsList: PropTypes.array,
    loadSuggestions: PropTypes.func,
    OptionTemplate: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    required: PropTypes.bool,
};

export default React.memo(AutoCompleteAsynchronousField);
