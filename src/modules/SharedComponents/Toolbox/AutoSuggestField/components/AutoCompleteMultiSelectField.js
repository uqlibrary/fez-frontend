import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

export const AutoCompleteMultiSelectField = ({
    autoCompleteMultiSelectFieldId,
    defaultValue,
    error,
    errorText,
    hintText,
    floatingLabelText,
    getOptionLabel,
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
            id={autoCompleteMultiSelectFieldId}
            multiple
            getOptionLabel={getOptionLabel}
            options={itemsList}
            onChange={handleChange}
            popupIcon={false}
            filterSelectedOptions
            disableClearable
            renderInput={params => (
                <TextField
                    variant="standard"
                    {...params}
                    error={error}
                    helperText={(error && errorText) || ''}
                    fullWidth
                    label={floatingLabelText}
                    placeholder={hintText}
                    required={required}
                    slotProps={{
                        htmlInput: {
                            ...params.inputProps,
                            id: `${autoCompleteMultiSelectFieldId}-input`,
                            'data-analyticsid': `${autoCompleteMultiSelectFieldId}-input`,
                            'data-testid': `${autoCompleteMultiSelectFieldId}-input`,
                        },
                    }}
                />
            )}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip
                        label={!!option.rek_title ? option.rek_title : option.rek_pid || option}
                        id={`${autoCompleteMultiSelectFieldId}-${index}`}
                        data-testid={`${autoCompleteMultiSelectFieldId}-${index}`}
                        {...getTagProps({ index })}
                    />
                ))
            }
            {...(!!OptionTemplate
                ? {
                      renderOption: (props, option) => (
                          <li {...props}>
                              <OptionTemplate option={option} />
                          </li>
                      ),
                  }
                : {})}
            {...((!!defaultValue && { value: defaultValue }) || {})}
            slotProps={{
                listbox: {
                    id: `${autoCompleteMultiSelectFieldId}-options`,
                    'data-analyticsid': `${autoCompleteMultiSelectFieldId}-options`,
                    'data-testid': `${autoCompleteMultiSelectFieldId}-options`,
                },
            }}
        />
    );
};

AutoCompleteMultiSelectField.propTypes = {
    autoCompleteMultiSelectFieldId: PropTypes.string.isRequired,
    defaultValue: PropTypes.array,
    error: PropTypes.bool,
    errorText: PropTypes.string,
    floatingLabelText: PropTypes.string,
    getOptionLabel: PropTypes.func.isRequired,
    hintText: PropTypes.string,
    itemsList: PropTypes.array,
    loadSuggestions: PropTypes.func,
    onChange: PropTypes.func,
    OptionTemplate: PropTypes.func,
    required: PropTypes.bool,
};

export default React.memo(AutoCompleteMultiSelectField);
