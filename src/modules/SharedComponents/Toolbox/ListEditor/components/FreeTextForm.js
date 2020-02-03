import React, { useCallback, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    MUITextLabel: theme.overrides.MuiFormLabel,
    remindToAdd: {
        marginTop: 8,
        color: '#f06f0d',
    },
});

const onItemChangeCallback = (setItem, normalize) => {
    const callback = event => setItem(normalize(event.target.value));

    return [callback, [setItem, normalize]];
};

export const FreeTextForm = ({
    onAdd,
    isValid,
    locale,
    disabled,
    errorText,
    remindToAdd,
    classes,
    maxInputLength,
    normalize,
    required,
    itemSelectedToEdit,
}) => {
    const [item, setItem] = useState(itemSelectedToEdit || '');
    const [itemSubmitted, setItemSubmitted] = useState(false);

    const onItemChange = useCallback(...onItemChangeCallback(setItem, normalize));
    const textField = useRef(null);

    useEffect(() => {
        if (itemSubmitted) {
            textField.current.focus();
            setItem('');
            setItemSubmitted(false);
        }

        if (!!itemSelectedToEdit) {
            setItem(itemSelectedToEdit);
        }
    }, [itemSelectedToEdit, itemSubmitted, textField]);

    const addItem = event => {
        // add item if user hits 'enter' key on input field
        if (disabled || isValid(item) !== '' || (event && event.key && event.key !== 'Enter') || item.length === 0) {
            return;
        }

        // pass on the selected item
        onAdd(item);
        setItemSubmitted(true);
    };

    const { inputFieldLabel, inputFieldHint, remindToAddText, addButtonLabel, id, editButtonLabel } = locale;
    const inputLengthText = item && item.length > maxInputLength && `Limited to ${maxInputLength} characters`;
    const validationErrorText = isValid(item) || errorText;
    return (
        <Grid container spacing={16} display="row" alignItems="center">
            <Grid item style={{ flexGrow: 1 }}>
                <TextField
                    fullWidth
                    id={id || ''}
                    inputProps={{
                        ref: textField,
                    }}
                    label={inputFieldLabel}
                    placeholder={inputFieldHint}
                    value={item}
                    onChange={onItemChange}
                    onKeyDown={addItem}
                    error={!!errorText || isValid(item) || !!inputLengthText}
                    helperText={
                        validationErrorText || inputLengthText
                            ? `${!!validationErrorText ? validationErrorText : ''}${
                                !!validationErrorText && !!inputLengthText ? ' - ' : ''
                            }${!!inputLengthText ? inputLengthText : ''}`
                            : null
                    }
                    disabled={disabled}
                    required={required}
                />
                {remindToAdd && remindToAddText && item.length !== 0 && !isValid(item) && (
                    <Typography variant="caption" className={classes.remindToAdd}>
                        {remindToAddText}
                    </Typography>
                )}
            </Grid>
            <Grid item xs={12} sm={2}>
                <Button
                    fullWidth
                    id="add-items"
                    color="primary"
                    variant="contained"
                    children={!!itemSelectedToEdit ? editButtonLabel : addButtonLabel}
                    disabled={disabled || isValid(item) !== '' || item.trim().length === 0 || !!inputLengthText}
                    onClick={addItem}
                />
            </Grid>
        </Grid>
    );
};

FreeTextForm.propTypes = {
    onAdd: PropTypes.func.isRequired,
    isValid: PropTypes.func,
    locale: PropTypes.object,
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    remindToAdd: PropTypes.bool,
    classes: PropTypes.object,
    maxInputLength: PropTypes.number,
    normalize: PropTypes.func,
    required: PropTypes.bool,
    itemSelectedToEdit: PropTypes.any,
};

FreeTextForm.defaultProps = {
    isValid: () => '',
    remindToAdd: false,
    maxInputLength: 2000,
    locale: {
        id: 'free-text-input',
        inputFieldLabel: 'Item name',
        inputFieldHint: 'Please type the item name',
        addButtonLabel: 'Add',
    },
    required: false,
    itemSelectedToEdit: '',
};

export default React.memo(withStyles(styles)(FreeTextForm));
