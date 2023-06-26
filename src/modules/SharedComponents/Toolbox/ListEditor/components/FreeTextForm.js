import React, { useCallback, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import { isValidKeyword } from 'config/validation';
import { indexOf } from 'lodash';

const useStyles = makeStyles(theme => ({
    MUITextLabel: theme.components.MuiFormLabel.styleOverrides,
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
    mode,
    normalize,
    required,
    itemSelectedToEdit,
    listEditorFormId,
    listEditorId,
    onSubmit,
}) => {
    const classes = useStyles();
    const [item, setItem] = useState(itemSelectedToEdit || '');
    const [itemSubmitted, setItemSubmitted] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        !!onAdd ? onAdd(item) : onSubmit(mode === 'add' ? [item] : item, indexOf);
        setItemSubmitted(true);
    };

    const { inputFieldLabel, inputFieldHint, remindToAddText, addButtonLabel, editButtonLabel } = locale;
    const inputLengthText = isValid(item);
    return (
        <Grid
            container
            spacing={2}
            display="row"
            alignItems="center"
            id={listEditorFormId}
            data-testid={listEditorFormId}
        >
            <Grid item style={{ flexGrow: 1 }}>
                <TextField
                    variant="standard"
                    fullWidth
                    id={`${listEditorId}-input`}
                    data-analyticsid={`${listEditorId}-input`}
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
                    id={`${listEditorId}-${mode}`}
                    data-analyticsid={`${listEditorId}-${mode}`}
                    data-testid={`${listEditorId}-${mode}`}
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
    mode: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    remindToAdd: PropTypes.bool,
    normalize: PropTypes.func,
    required: PropTypes.bool,
    itemSelectedToEdit: PropTypes.any,
    listEditorFormId: PropTypes.string,
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
    mode: 'add',
};

export default React.memo(FreeTextForm);
