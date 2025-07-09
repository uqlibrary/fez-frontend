import React from 'react';
import PropTypes from 'prop-types';

import { ALTERNATE_IDENTIFIER_TYPE } from 'config/general';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField/components/NewGenericSelectField';

export const AlternateIdentifierForm = ({ disabled, locale, onAdd, itemSelectedToEdit }) => {
    const [alternateIdentifier, setAlternateIdentifier] = React.useState(null);
    const [alternateIdentifierType, setAlternateIdentifierType] = React.useState(null);
    const alternateIdentifierInput = React.useRef(null);
    const alternateIdentifierTypeInput = React.useRef(null);

    React.useEffect(() => {
        if (!!itemSelectedToEdit && !!itemSelectedToEdit.key) {
            setAlternateIdentifier(itemSelectedToEdit.key);
            setAlternateIdentifierType(itemSelectedToEdit.value);
        }
    }, [itemSelectedToEdit]);

    const resetForm = () => {
        setAlternateIdentifier(null);
        setAlternateIdentifierType(null);
        alternateIdentifierInput.current.value = null;
        alternateIdentifierTypeInput.current.value = null;
    };

    const handleIdentifierChange = React.useCallback(event => {
        setAlternateIdentifier(event.target.value);
    }, []);

    const handleIdentifierTypeChange = value => {
        setAlternateIdentifierType(value);
    };

    const handleSubmit = React.useCallback(
        () => {
            onAdd({ key: alternateIdentifier, value: alternateIdentifierType });
            resetForm();
            alternateIdentifierInput.current.focus();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [alternateIdentifier, alternateIdentifierType],
    );

    const {
        alternateIdentifierInputFieldLabel,
        alternateIdentifierInputFieldHint,
        alternateIdentifierTypeInputFieldLabel,
        alternateIdentifierTypeInputFieldHint,
        addButtonLabel,
        editButtonLabel,
    } = locale;

    return (
        <Grid container spacing={2} display="row" alignItems="center">
            <Grid item style={{ flexGrow: 1 }} xs={12} sm={6} md={5}>
                <TextField
                    key={(itemSelectedToEdit || {}).key}
                    fullWidth
                    name="alternateIdentifier"
                    textFieldId="rek-alternate-identifier"
                    label={alternateIdentifierInputFieldLabel}
                    placeholder={alternateIdentifierInputFieldHint}
                    onChange={handleIdentifierChange}
                    disabled={disabled}
                    inputProps={{
                        ref: alternateIdentifierInput,
                    }}
                    defaultValue={(itemSelectedToEdit || {}).key || ''}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
                <NewGenericSelectField
                    key={(itemSelectedToEdit || {}).value}
                    fullWidth
                    name="alternateIdentifierType"
                    genericSelectFieldId="rek-alternate-identifier-type"
                    label={alternateIdentifierTypeInputFieldLabel}
                    placeholder={alternateIdentifierTypeInputFieldHint}
                    onChange={handleIdentifierTypeChange}
                    disabled={disabled}
                    itemsList={ALTERNATE_IDENTIFIER_TYPE}
                    value={alternateIdentifierType}
                    inputProps={{
                        ref: alternateIdentifierTypeInput,
                    }}
                />
            </Grid>
            <Grid item xs={12} md={2}>
                <Button
                    fullWidth
                    id="add-items"
                    data-analyticsid="rek-alternate-identifier-add"
                    data-testid="rek-alternate-identifier-add"
                    color="primary"
                    variant="contained"
                    children={!!itemSelectedToEdit ? editButtonLabel : addButtonLabel}
                    disabled={disabled || !alternateIdentifier}
                    onClick={handleSubmit}
                />
            </Grid>
        </Grid>
    );
};

AlternateIdentifierForm.propTypes = {
    onAdd: PropTypes.func.isRequired,
    locale: PropTypes.object,
    disabled: PropTypes.bool,
    itemSelectedToEdit: PropTypes.object,
};

export default React.memo(AlternateIdentifierForm);
