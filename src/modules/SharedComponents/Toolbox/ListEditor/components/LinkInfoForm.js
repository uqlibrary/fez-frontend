import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { url } from 'config/validation';

export const handleChangeCallback = (linkAndDescription, setErrorText) => {
    const callback = event => {
        const { name, value } = event.target;
        linkAndDescription[name] = value;
        setErrorText(url(linkAndDescription.key));
    };
    return [callback, [linkAndDescription]];
};

export const resetFormCallbackFactory = (linkInput, descriptionInput, linkAndDescription) => {
    const callback = () => {
        linkAndDescription.key = null;
        linkAndDescription.value = null;
        linkInput.current.value = null;
        descriptionInput.current.value = null;
    };
    return [callback, [linkInput, descriptionInput, linkAndDescription]];
};

export const addItemCallbackFactory = (linkInput, disabled, errorText, linkAndDescription, onAdd, resetForm) => {
    const callback = event => {
        // add item if user hits 'enter' key on input field
        if (disabled || errorText || !linkAndDescription.key || (event && event.key && event.key !== 'Enter')) {
            return;
        }
        // pass on the selected item
        onAdd({ ...linkAndDescription });
        resetForm();

        // move focus to name as published text field after item was added
        linkInput.current.focus();
    };
    return [callback, [linkInput, disabled, linkAndDescription, onAdd, resetForm, errorText]];
};

export const LinkInfoForm = ({ disabled, locale, onAdd, itemSelectedToEdit }) => {
    const linkAndDescription = useRef(itemSelectedToEdit || { key: null, value: null });
    const [errorText, setErrorText] = useState(null);
    const linkInput = useRef(null);
    const descriptionInput = useRef(null);

    const handleChange = useCallback(...handleChangeCallback(linkAndDescription.current, setErrorText));
    const resetForm = useCallback(...resetFormCallbackFactory(linkInput, descriptionInput, linkAndDescription.current));
    const addItem = useCallback(
        ...addItemCallbackFactory(linkInput, disabled, errorText, linkAndDescription.current, onAdd, resetForm),
    );

    const {
        linkInputFieldLabel,
        linkInputFieldHint,
        descriptionInputFieldLabel,
        descriptionInputFieldHint,
        addButtonLabel,
        editButtonLabel,
    } = locale;

    return (
        <Grid container spacing={2} display="row" alignItems="center">
            <Grid item style={{ flexGrow: 1 }} xs={12} sm={6} md={5}>
                <TextField
                    fullWidth
                    name="key"
                    textFieldId="rek-link"
                    label={linkInputFieldLabel}
                    placeholder={linkInputFieldHint}
                    onChange={handleChange}
                    onKeyDown={addItem}
                    error={!!errorText}
                    errorText={errorText}
                    disabled={disabled}
                    inputProps={{
                        ref: linkInput,
                    }}
                    defaultValue={linkAndDescription.current.key || (itemSelectedToEdit || {}).key || ''}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
                <TextField
                    fullWidth
                    name="value"
                    textFieldId="rek-link-description"
                    label={descriptionInputFieldLabel}
                    placeholder={descriptionInputFieldHint}
                    onChange={handleChange}
                    onKeyDown={addItem}
                    disabled={disabled}
                    inputProps={{
                        ref: descriptionInput,
                    }}
                    defaultValue={linkAndDescription.current.value || (itemSelectedToEdit || {}).value || ''}
                />
            </Grid>
            <Grid item xs={12} md={2}>
                <Button
                    fullWidth
                    id="add-items"
                    data-testid="rek-link-add"
                    color="primary"
                    variant="contained"
                    children={!!itemSelectedToEdit ? editButtonLabel : addButtonLabel}
                    disabled={disabled || !!errorText || !linkAndDescription.current.key}
                    onClick={addItem}
                />
            </Grid>
        </Grid>
    );
};

LinkInfoForm.propTypes = {
    onAdd: PropTypes.func.isRequired,
    locale: PropTypes.object,
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    itemSelectedToEdit: PropTypes.object,
};

export default React.memo(LinkInfoForm);
