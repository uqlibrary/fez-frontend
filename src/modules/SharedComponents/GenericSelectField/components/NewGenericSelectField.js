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
    hideLabel,
    hintText,
    itemsList,
    itemsLoading,
    label,
    loadingHint,
    loadItemsList,
    multiple,
    onChange,
    required,
    value,
    style,
    genericSelectFieldId,
}) => {
    const classes = useStyles();
    React.useEffect(() => {
        if (itemsList.length === 0 && loadItemsList) {
            loadItemsList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const _itemSelected = event => {
        let value = event.target.value;
        if (value[0] === -1) {
            if (value.length === 1) {
                value = '';
            }
            if (value.length > 1) {
                value.shift();
            }
        }
        onChange(value);
    };

    const newValue = () => {
        if (multiple) {
            if (hideLabel) {
                return (value && value.length > 0 && value) || [-1];
            } else {
                return (value && value.length > 0 && value) || [];
            }
        } else {
            if (hideLabel) {
                return (value && value.length > 0 && value) || '-1';
            } else {
                return value || '-1';
            }
        }
    };

    const renderMenuItems = () => {
        return [
            hideLabel && (
                <MenuItem value={-1} key={0} style={{ display: 'block' }} disabled>
                    {itemsLoading ? loadingHint : hintText}
                </MenuItem>
            ),
            ...itemsList.map((item, index) => {
                return (
                    <MenuItem
                        classes={{ selected: classes.selectedMenuItem }}
                        style={{ display: 'block' }}
                        selected={(multiple && value.includes(item.value || item)) || undefined}
                        value={item.value || item}
                        key={index + 1}
                        disabled={item && ((!canUnselect && !item.value) || !!item.disabled)}
                        aria-label={item.text || item.value || item}
                        data-testid={`${genericSelectFieldId}-option-${index}`}
                    >
                        {item.text || item.value || item}
                    </MenuItem>
                );
            }),
        ];
    };

    return (
        <FormControl fullWidth required={required} error={!!error}>
            <InputLabel
                hidden={hideLabel}
                data-testid={`${genericSelectFieldId}-label`}
                id={`${genericSelectFieldId}-label`}
            >
                {label}
            </InputLabel>
            <Select
                disabled={disabled || !!itemsLoading}
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
                onChange={_itemSelected}
                style={style}
                SelectDisplayProps={{
                    id: `${genericSelectFieldId}-select`,
                    'data-testid': `${genericSelectFieldId}-select`,
                }}
                value={newValue()}
            >
                {renderMenuItems()}
            </Select>
            {!!error && (
                <FormHelperText
                    error={!!error}
                    data-testid={`${genericSelectFieldId}-helper-text`}
                    id={`${genericSelectFieldId}-helper-text`}
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
    genericSelectFieldId: PropTypes.string.isRequired,
    hideLabel: PropTypes.bool,
    hintText: PropTypes.string,
    itemsList: PropTypes.array,
    itemsLoading: PropTypes.bool,
    label: PropTypes.string,
    loadingHint: PropTypes.string,
    loadItemsList: PropTypes.func,
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    style: PropTypes.object,
    value: PropTypes.any,
};

NewGenericSelectField.defaultProps = {
    itemsList: [],
    canUnselect: false,
    hintText: null,
    multiple: false,
};

export default React.memo(NewGenericSelectField);
