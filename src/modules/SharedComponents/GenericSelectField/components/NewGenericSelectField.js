import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

/**
 * 'canUnselect' prop allows the editing user to 'unselect' the entry in the dropdown
 * Requires a transformer to cover the key in question
 * (At time of writing, rek_herdc_code, rek_herdc_status, and rek_institutional_status have transformers)
 */

export const NewGenericSelectField = ({
    canUnselect = false,
    disabled,
    displayEmpty,
    error,
    errorText,
    formHelperTextProps,
    genericSelectFieldId,
    hideLabel,
    itemsList = [],
    itemsLoading,
    label,
    loadItemsList,
    loadingHint = 'Loading items...',
    meta,
    multiple = false,
    onChange,
    required,
    selectPrompt = 'Please select an option',
    selectProps,
    style,
    value,
}) => {
    const [selectValue, setSelectValue] = React.useState(multiple ? [] : '');
    const [inputError, setInputError] = React.useState(!!error);
    const [inputErrorText, setInputErrorText] = React.useState(errorText || error || null);
    const promptMenuItem = {
        value: '',
        text: selectPrompt,
        disabled: true,
    };

    const loadingMenuItem = {
        value: '',
        text: loadingHint,
        disabled: true,
    };

    /* Run this effect if items list are needed to be loaded from api */
    React.useEffect(() => {
        if (itemsList.length === 0 && loadItemsList) {
            loadItemsList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Run this effect to set value for non redux-form field */
    React.useEffect(() => {
        if (multiple) {
            value.length > 0 ? setSelectValue(value) : setSelectValue([]);
        } else {
            !!value ? setSelectValue(value) : setSelectValue('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    /* Run this effect to set error state for redux-form field */
    React.useEffect(() => {
        if (!!meta) {
            setInputError(!!meta.error);
            setInputErrorText(meta.error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meta]);

    /* Run this effect to set error state for non redux-form field */
    React.useEffect(() => {
        if (!meta) {
            setInputError(!!error);
            setInputErrorText(!!error ? errorText || error : null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    const handleChange = React.useCallback(event => {
        onChange?.(event.target.value) || /* istanbul ignore next */ onChange?.(event.target.value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderMenuItems = itemsList => {
        return [
            itemsList.map((item, index) => {
                return (
                    <MenuItem
                        sx={{
                            whiteSpace: 'unset',
                            wordBreak: 'break-word',
                            display: 'block',
                            // 1200px is the width of pages on the App. This is static
                            // so there is no need to make the style property dynamic at this stage
                            maxWidth: '1200px',
                            '&.Mui-selected': {
                                backgroundColor: 'accent.main',
                                color: 'white.main',
                            },
                        }}
                        selected={(multiple && selectValue.includes(item.value)) || undefined}
                        value={item.value}
                        key={index + 1}
                        disabled={item && ((!canUnselect && !item.value) || !!item.disabled)}
                        aria-label={item.text}
                        data-analyticsid={`${genericSelectFieldId}-option-${index}`}
                        data-testid={`${genericSelectFieldId}-option-${index}`}
                    >
                        {item.text}
                    </MenuItem>
                );
            }),
        ];
    };

    return (
        <FormControl variant="standard" fullWidth required={required} error={!!inputError}>
            {!hideLabel && (
                <InputLabel
                    hidden={hideLabel}
                    data-testid={`${genericSelectFieldId}-label`}
                    id={`${genericSelectFieldId}-label`}
                >
                    {label}
                </InputLabel>
            )}
            <Select
                variant="standard"
                disabled={disabled}
                displayEmpty={displayEmpty}
                inputProps={{
                    'aria-labelledby': `${genericSelectFieldId}-label`,
                    'data-analyticsid': `${genericSelectFieldId}-input`,
                    'data-testid': `${genericSelectFieldId}-input`,
                    id: `${genericSelectFieldId}-input`,
                }}
                multiple={multiple}
                MenuProps={{
                    id: `${genericSelectFieldId}-options`,
                    'data-analyticsid': `${genericSelectFieldId}-options`,
                    'data-testid': `${genericSelectFieldId}-options`,
                }}
                onChange={handleChange}
                style={style}
                SelectDisplayProps={{
                    id: `${genericSelectFieldId}-select`,
                    'data-testid': `${genericSelectFieldId}-select`,
                }}
                value={selectValue}
                {...(hideLabel && multiple ? { renderValue: /* istanbul ignore next */ () => selectPrompt } : {})}
                {...(!!selectProps ? { ...selectProps } : {})}
            >
                {itemsLoading ? renderMenuItems([loadingMenuItem]) : renderMenuItems([promptMenuItem, ...itemsList])}
            </Select>
            {!!inputError && (
                <FormHelperText
                    error={!!inputError}
                    data-testid={`${genericSelectFieldId}-helper-text`}
                    id={`${genericSelectFieldId}-helper-text`}
                    {...(!!formHelperTextProps ? { ...formHelperTextProps } : {})}
                >
                    {inputErrorText}
                </FormHelperText>
            )}
        </FormControl>
    );
};

NewGenericSelectField.propTypes = {
    canUnselect: PropTypes.bool,
    disabled: PropTypes.bool,
    displayEmpty: PropTypes.bool,
    error: PropTypes.any,
    errorText: PropTypes.string,
    formHelperTextProps: PropTypes.object,
    genericSelectFieldId: PropTypes.string.isRequired,
    hideLabel: PropTypes.bool,
    meta: PropTypes.object,
    itemsList: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            disabled: PropTypes.bool,
        }),
    ),
    itemsLoading: PropTypes.bool,
    label: PropTypes.string,
    loadingHint: PropTypes.string,
    loadItemsList: PropTypes.func,
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    selectPrompt: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.any,
    selectProps: PropTypes.object,
};

NewGenericSelectField.displayName = 'NewGenericSelectField';

export default React.memo(NewGenericSelectField);
