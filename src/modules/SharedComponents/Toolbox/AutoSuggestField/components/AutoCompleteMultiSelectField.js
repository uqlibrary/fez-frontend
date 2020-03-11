import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export const AutoCompleteMultiSelectField = ({
    defaultValue,
    error,
    errorText,
    floatingLabelText,
    getOptionLabel,
    id,
    itemsList,
    loadSuggestions,
    onChange,
    OptionTemplate,
    required,
}) => {
    const handleChange = useCallback((event, value) => {
        onChange(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!!loadSuggestions) {
            loadSuggestions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Autocomplete
            id={id || 'auto-complete-multi-select-field'}
            multiple
            getOptionLabel={getOptionLabel}
            options={itemsList}
            onChange={handleChange}
            popupIcon={false}
            renderInput={params => (
                <TextField
                    {...params}
                    error={error}
                    helperText={(error && errorText) || ''}
                    fullWidth
                    label={floatingLabelText}
                    required={required}
                />
            )}
            {...(!!OptionTemplate ? { renderOption: option => <OptionTemplate option={option} /> } : {})}
            {...((!!defaultValue && { value: defaultValue }) || {})}
        />
    );
};

AutoCompleteMultiSelectField.propTypes = {
    defaultValue: PropTypes.array,
    error: PropTypes.bool,
    errorText: PropTypes.string,
    floatingLabelText: PropTypes.string,
    getOptionLabel: PropTypes.func.isRequired,
    id: PropTypes.string,
    itemsList: PropTypes.array,
    loadSuggestions: PropTypes.func,
    OptionTemplate: PropTypes.func,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    required: PropTypes.bool,
};

export default React.memo(AutoCompleteMultiSelectField);
