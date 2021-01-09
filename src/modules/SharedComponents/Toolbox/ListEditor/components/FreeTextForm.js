import React, { useCallback, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { isValidKeyword } from 'config/validation';

const useStyles = makeStyles(theme => ({
    MUITextLabel: theme.overrides.MuiFormLabel,
    remindToAdd: {
        marginTop: 8,
        color: '#f06f0d',
    },
}));

const onItemChangeCallback = (setItem, normalize) => {
    const callback = event => setItem(normalize(event.target.value));

    return [callback, [setItem, normalize]];
};

export const FreeTextForm = ({
    onAdd,
    isValid,
    locale,
    disabled,
    error,
    remindToAdd,
    normalize,
    required,
    itemSelectedToEdit,
    listEditorId,
    onSubmit,
}) => {
    const classes = useStyles();
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
        if (disabled || (event && event.key && event.key !== 'Enter') || item.length === 0) {
            return;
        }

        // pass on the selected item
        !!onAdd ? onAdd(item) : onSubmit([item]);
        setItemSubmitted(true);
    };

    const { inputFieldLabel, inputFieldHint, remindToAddText, addButtonLabel, id, editButtonLabel } = locale;
    const inputLengthText = isValid(item);
    return (
        <Grid container spacing={2} display="row" alignItems="center">
            <Grid item style={{ flexGrow: 1 }}>
                <TextField
                    fullWidth
                    id={id}
                    data-testid={`${listEditorId}-input`}
                    inputProps={{
                        ref: textField,
                    }}
                    label={inputFieldLabel}
                    placeholder={inputFieldHint}
                    value={item}
                    onChange={onItemChange}
                    onKeyDown={addItem}
                    error={!!inputLengthText || (error && item.length === 0)}
                    helperText={inputLengthText}
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
                    id={`add-${listEditorId}`}
                    data-testid={`${listEditorId}-add`}
                    color="primary"
                    variant="contained"
                    children={!!itemSelectedToEdit ? editButtonLabel : addButtonLabel}
                    disabled={disabled || item.trim().length === 0 || !!inputLengthText}
                    onClick={addItem}
                />
            </Grid>
        </Grid>
    );
};

FreeTextForm.propTypes = {
    onAdd: PropTypes.func,
    isValid: PropTypes.func,
    locale: PropTypes.object,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    remindToAdd: PropTypes.bool,
    normalize: PropTypes.func,
    required: PropTypes.bool,
    itemSelectedToEdit: PropTypes.any,
    listEditorId: PropTypes.string,
    onSubmit: PropTypes.func,
};

FreeTextForm.defaultProps = {
    isValid: isValidKeyword(2000),
    remindToAdd: false,
    locale: {
        id: 'free-text-input',
        inputFieldLabel: 'Item name',
        inputFieldHint: 'Please type the item name',
        addButtonLabel: 'Add',
    },
    required: false,
    itemSelectedToEdit: '',
};

export default React.memo(FreeTextForm);
