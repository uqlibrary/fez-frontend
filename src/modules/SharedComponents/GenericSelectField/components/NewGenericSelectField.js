import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    theme => ({
        selectedMenuItem: {
            backgroundColor: `${theme.palette.accent.main} !important`,
            color: theme.palette.white.main,
        },
    }),
    { withTheme: true },
);

/**
 * 'canUnselect' prop allows the editing user to 'unselect' the entry in the dropdown
 * Requires a transformer to cover the key in question
 * (At time of writing, rek_herdc_code, rek_herdc_status, and rek_institutional_status have transformers)
 */

export const NewGenericSelectField = ({
    canUnselect,
    disabled,
    displayEmpty,
    error,
    errorText,
    formHelperTextProps,
    genericSelectFieldId,
    hideLabel,
    itemsList,
    itemsLoading,
    label,
    loadItemsList,
    loadingHint,
    multiple,
    onChange,
    required,
    selectPrompt,
    selectProps,
    style,
    value,
}) => {
    const classes = useStyles();

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

    React.useEffect(() => {
        if (itemsList.length === 0 && loadItemsList) {
            loadItemsList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleChange = React.useCallback(event => onChange(event.target.value), []);

    const renderMenuItems = itemsList => {
        return [
            itemsList.map((item, index) => {
                return (
                    <MenuItem
                        classes={{ selected: classes.selectedMenuItem }}
                        style={{ display: 'block' }}
                        selected={(multiple && value.includes(item.value)) || undefined}
                        value={item.value}
                        key={index + 1}
                        disabled={item && ((!canUnselect && !item.value) || !!item.disabled)}
                        aria-label={item.text}
                        data-testid={`${genericSelectFieldId}-option-${index}`}
                    >
                        {item.text}
                    </MenuItem>
                );
            }),
        ];
    };

    return (
        <FormControl fullWidth required={required} error={!!error}>
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
                disabled={disabled}
                displayEmpty={displayEmpty}
                inputProps={{
                    'aria-labelledby': `${genericSelectFieldId}-label`,
                    'data-testid': `${genericSelectFieldId}-input`,
                    id: `${genericSelectFieldId}-input`,
                }}
                multiple={multiple}
                MenuProps={{
                    id: `${genericSelectFieldId}-options`,
                    'data-testid': `${genericSelectFieldId}-options`,
                }}
                onChange={handleChange}
                style={style}
                SelectDisplayProps={{
                    id: `${genericSelectFieldId}-select`,
                    'data-testid': `${genericSelectFieldId}-select`,
                }}
                value={value}
                {...(!!selectProps ? { ...selectProps } : {})}
            >
                {itemsLoading ? renderMenuItems([loadingMenuItem]) : renderMenuItems([promptMenuItem, ...itemsList])}
            </Select>
            {!!error && (
                <FormHelperText
                    error={!!error}
                    data-testid={`${genericSelectFieldId}-helper-text`}
                    id={`${genericSelectFieldId}-helper-text`}
                    {...(!!formHelperTextProps ? { ...formHelperTextProps } : {})}
                >
                    {errorText}
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

NewGenericSelectField.defaultProps = {
    itemsList: [],
    canUnselect: false,
    multiple: false,
    selectPrompt: 'Please select an option',
    loadingHint: 'Loading items...',
};

export default React.memo(NewGenericSelectField);
