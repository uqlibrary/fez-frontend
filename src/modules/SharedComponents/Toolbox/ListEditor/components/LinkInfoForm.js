import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export const LinkInfoForm = ({ disabled, locale, errorText, onAdd }) => {
    const [linkAndDescription, setLinkAndDescription] = useState({ key: null, value: null });
    const linkInput = useRef(null);
    const descriptionInput = useRef(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLinkAndDescription({
            ...linkAndDescription,
            [name]: value,
        });
    };

    const resetForm = () => {
        setLinkAndDescription({
            key: null,
            value: null,
        });
        linkInput.current.value = null;
        descriptionInput.current.value = null;
    };

    const addItem = useCallback(
        (event) => {
            // add item if user hits 'enter' key on input field
            if (
                disabled ||
                !linkAndDescription.key ||
                !linkAndDescription.value ||
                (event && event.key && event.key !== 'Enter')
            ) {
                return;
            }
            // pass on the selected item
            onAdd(linkAndDescription);
            resetForm();
            // move focus to name as published text field after item was added
            /* istanbul if ignore */
            descriptionInput.current.focus();
            // linkInput.current.focus();
        },
        [disabled, linkAndDescription, onAdd]
    );

    const {
        linkInputFieldLabel,
        linkInputFieldHint,
        descriptionInputFieldLabel,
        descriptionInputFieldHint,
        addButtonLabel,
        id,
    } = locale;

    return (
        <Grid container spacing={16} display="row" alignItems="center">
            <Grid item style={{ flexGrow: 1 }} xs={12} sm={6} md={5}>
                <TextField
                    fullWidth
                    name="key"
                    id={(!!id && id) || ''}
                    label={linkInputFieldLabel}
                    placeholder={linkInputFieldHint}
                    onChange={handleChange}
                    onKeyPress={addItem}
                    error={!!errorText}
                    disabled={disabled}
                    inputProps={{
                        ref: linkInput,
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
                <TextField
                    fullWidth
                    name="value"
                    id={(!!id && id) || ''}
                    label={descriptionInputFieldLabel}
                    placeholder={descriptionInputFieldHint}
                    onChange={handleChange}
                    onKeyPress={addItem}
                    error={!!errorText}
                    disabled={disabled}
                    inputProps={{
                        ref: descriptionInput,
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
                    disabled={disabled}
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
};

export default React.memo(LinkInfoForm);
