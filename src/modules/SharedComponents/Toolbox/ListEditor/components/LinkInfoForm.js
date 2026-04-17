import React from 'react';
import PropTypes from 'prop-types';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import Grid from '@mui/material/GridLegacy';
import Button from '@mui/material/Button';
import { url } from 'config/validation';

export const LinkInfoForm = ({ disabled, locale, onAdd, itemSelectedToEdit }) => {
    const [link, setLink] = React.useState(null);
    const [description, setDescription] = React.useState(null);
    const [errorText, setErrorText] = React.useState(null);
    const linkInput = React.useRef(null);
    const descriptionInput = React.useRef(null);

    React.useEffect(() => {
        if (!!itemSelectedToEdit && !!itemSelectedToEdit.key) {
            setLink(itemSelectedToEdit.key);
            setDescription(itemSelectedToEdit.value);
        }
    }, [itemSelectedToEdit]);

    const resetForm = () => {
        setLink(null);
        setDescription(null);
        linkInput.current.value = null;
        descriptionInput.current.value = null;
    };

    const handleChange = React.useCallback(event => {
        const { name, value } = event.target;

        if (name === 'link') {
            setLink(value);
            setErrorText(url(value));
        }

        if (name === 'description') {
            setDescription(value);
        }
    }, []);

    const handleSubmit = React.useCallback(
        event => {
            if (disabled || errorText || !link || (event && event.key && event.key !== 'Enter')) {
                return;
            }
            onAdd({ key: link, value: description });
            resetForm();
            linkInput.current.focus();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [link, description],
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
                    key={(itemSelectedToEdit || {}).key}
                    fullWidth
                    name="link"
                    textFieldId="rek-link"
                    label={linkInputFieldLabel}
                    placeholder={linkInputFieldHint}
                    onChange={handleChange}
                    onKeyDown={handleSubmit}
                    error={!!errorText}
                    errorText={errorText}
                    disabled={disabled}
                    inputProps={{
                        ref: linkInput,
                    }}
                    defaultValue={(itemSelectedToEdit || {}).key || ''}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
                <TextField
                    key={(itemSelectedToEdit || {}).value}
                    fullWidth
                    name="description"
                    textFieldId="rek-link-description"
                    label={descriptionInputFieldLabel}
                    placeholder={descriptionInputFieldHint}
                    onChange={handleChange}
                    onKeyDown={handleSubmit}
                    disabled={disabled}
                    inputProps={{
                        ref: descriptionInput,
                    }}
                    defaultValue={(itemSelectedToEdit || {}).value || ''}
                />
            </Grid>
            <Grid item xs={12} md={2}>
                <Button
                    fullWidth
                    id="add-items"
                    data-analyticsid="rek-link-add"
                    data-testid="rek-link-add"
                    color="primary"
                    variant="contained"
                    children={!!itemSelectedToEdit ? editButtonLabel : addButtonLabel}
                    disabled={disabled || !!errorText || !link}
                    onClick={handleSubmit}
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
