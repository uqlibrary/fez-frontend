import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export const handleChangeCallbackFactory = (issnValue, setIssn) => {
    const callback = event => {
        const { name, value } = event.target;
        setIssn({
            ...issnValue,
            [name]: value,
        });
    };
    return [callback, [issnValue, setIssn]];
};

export const resetFormCallbackFactory = (issnInput, setIssn) => {
    const callback = () => {
        setIssn({
            key: null,
            value: null,
        });
        issnInput.current.value = null;
    };
    return [callback, [issnInput, setIssn]];
};

export const addItemCallbackFactory = (issnInput, disabled, errorText, issnValue, onAdd, resetForm) => {
    const callback = event => {
        // add item if user hits 'enter' key on input field
        if (disabled || errorText || !issnValue.key || (event && event.key && event.key !== 'Enter')) {
            return;
        }
        // pass on the selected item
        onAdd(issnValue);
        resetForm();

        // move focus to name as published text field after item was added
        issnInput.current.focus();
    };
    return [callback, [issnInput, disabled, issnValue, onAdd, resetForm, errorText]];
};

export const IssnForm = ({ disabled, locale, onAdd }) => {
    const [issnValue, setIssn] = useState({ key: null, value: null });
    const [errorText, setErrorText] = useState(null);
    const issnInput = useRef(null);

    const handleChange = useCallback(...handleChangeCallbackFactory(issnValue, setIssn, setErrorText));
    const resetForm = useCallback(...resetFormCallbackFactory(issnInput, setIssn));
    const addItem = useCallback(...addItemCallbackFactory(issnInput, disabled, errorText, issnValue, onAdd, resetForm));

    const { inputFieldLabel, inputFieldHint, addButtonLabel, id } = locale;

    return (
        <Grid container spacing={16} display="row" alignItems="center">
            <Grid item style={{ flexGrow: 1 }}>
                <TextField
                    fullWidth
                    name="key"
                    id={(!!id && id) || ''}
                    label={inputFieldLabel}
                    placeholder={inputFieldHint}
                    onChange={handleChange}
                    onKeyPress={addItem}
                    error={!!errorText}
                    helperText={errorText}
                    disabled={disabled}
                    inputProps={{
                        ref: issnInput,
                    }}
                />
            </Grid>
            <Grid item xs={12} md={2}>
                <Button
                    fullWidth
                    id="add-items"
                    color="primary"
                    variant="contained"
                    children={addButtonLabel}
                    disabled={disabled || !!errorText}
                    onClick={addItem}
                />
            </Grid>
        </Grid>
    );
};

IssnForm.propTypes = {
    onAdd: PropTypes.func.isRequired,
    locale: PropTypes.object,
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
};

export default React.memo(IssnForm);
