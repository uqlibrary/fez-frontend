import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { ORG_AFFILIATION_TYPES, ORG_TYPE_NOT_SET } from 'config/general';
import validationLocale from 'locale/validationErrors';

export const GrantListEditorForm = ({
    disabled,
    grantSelectedToEdit,
    hideType = false,
    isPopulated,
    locale = {
        grantAgencyNameLabel: 'Funder/Sponsor name',
        grantAgencyNameHint: 'Funder/sponsor name for this work',
        grantIdLabel: 'Grant ID',
        grantIdHint: 'Grant number for this work',
        grantAgencyTypeLabel: 'Funder/Sponsor type',
        grantAgencyTypeHint: 'Funder/Sponsor type',
        addButton: 'Add grant',
        editButton: 'Edit grant',
        description:
            "Add the Funder/Sponsor's name, grant ID and type - then click the ADD GRANT button to add each to the list",
        remindToAdd: (
            <span>
                &nbsp;<b>* REMINDER:</b> Click ADD GRANT to add this item to your list or it will not be included.
            </span>
        ),
    },
    onAdd,
    required,
}) => {
    const [grant, setGrant] = React.useState({ grantAgencyName: '', grantId: '', grantAgencyType: '' });
    const [dirty, setDirty] = React.useState(null);

    React.useEffect(() => {
        if (!!grantSelectedToEdit) {
            setGrant(grant => ({
                ...grant,
                ...grantSelectedToEdit,
                grantAgencyType:
                    grantSelectedToEdit.grantAgencyType === ORG_TYPE_NOT_SET ? '' : grantSelectedToEdit.grantAgencyType,
            }));
        }
    }, [grantSelectedToEdit]);

    React.useEffect(() => {
        if (!!isPopulated && dirty) {
            isPopulated(true);
        } else {
            isPopulated(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dirty]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleChange = React.useCallback(event => {
        const { name, value } = event.target;

        setGrant(grant => ({
            ...grant,
            [name]: value,
        }));
        setDirty(true);
    });

    const _addGrant = event => {
        if (
            (event && event.key && (event.key !== 'Enter' || !grant.grantAgencyName)) ||
            (event &&
                event.key &&
                event.key === 'Enter' &&
                (!grant.grantAgencyName || (!hideType && !grant.grantAgencyType)))
        ) {
            return;
        }

        // pass on the selected grant
        onAdd(grant);
        setDirty(false);
        setGrant({ grantAgencyName: '', grantId: '', grantAgencyType: '' });
    };

    const {
        addButton,
        editButton,
        description,
        grantAgencyNameLabel,
        grantAgencyNameHint,
        grantIdHint,
        grantIdLabel,
        grantAgencyTypeLabel,
        grantAgencyTypeHint,
    } = locale;

    const { grantAgencyName, grantAgencyType, grantId } = grant;
    return (
        <React.Fragment>
            {description}
            <Grid container spacing={1} style={{ marginTop: 8 }}>
                <Grid item xs={12} sm={12} md>
                    <TextField
                        fullWidth
                        name="grantAgencyName"
                        textFieldId="rek-grant-agency"
                        label={grantAgencyNameLabel}
                        placeholder={grantAgencyNameHint}
                        value={grantAgencyName}
                        onChange={handleChange}
                        onKeyDown={_addGrant}
                        disabled={disabled}
                        required={required}
                        autoComplete="off"
                        error={required && !grantAgencyName}
                        errorText={required && !grantAgencyName && validationLocale.validationErrors.required}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={!hideType ? 3 : 4}>
                    <TextField
                        fullWidth
                        name="grantId"
                        textFieldId="rek-grant-id"
                        label={grantIdLabel}
                        placeholder={grantIdHint}
                        value={grantId}
                        onChange={handleChange}
                        onKeyDown={_addGrant}
                        disabled={disabled || !grantAgencyName || grantAgencyName.trim().length === 0}
                        required={required}
                    />
                </Grid>
                {!hideType && (
                    <Grid item xs={12} sm={12} md={3}>
                        <FormControl
                            variant="standard"
                            fullWidth
                            required={required || (!!grantAgencyName && grantAgencyName.trim().length > 0)}
                            error={!!grantAgencyName && grantAgencyName.trim().length > 0 && !grantAgencyType}
                        >
                            <Typography variant="caption" color="secondary" style={{ marginBottom: -3 }}>
                                {!!grantAgencyType ? grantAgencyTypeLabel : ' '}&nbsp;
                            </Typography>
                            <Select
                                variant="standard"
                                SelectDisplayProps={{
                                    id: 'rek-grant-type-select',
                                    'data-testid': 'rek-grant-type-select',
                                }}
                                MenuProps={{
                                    id: 'rek-grant-type-options',
                                    'data-testid': 'rek-grant-type-options',
                                }}
                                inputProps={{
                                    id: 'rek-grant-type-input',
                                    'data-testid': 'rek-grant-type-input',
                                }}
                                name="grantAgencyType"
                                label={grantAgencyType}
                                placeholder={grantAgencyTypeHint}
                                displayEmpty
                                value={grantAgencyType}
                                onChange={handleChange}
                                disabled={disabled || !grantAgencyName || grantAgencyName.trim().length === 0}
                            >
                                <MenuItem value="" disabled>
                                    {grantAgencyTypeHint}
                                </MenuItem>
                                {ORG_AFFILIATION_TYPES.map((item, index) => {
                                    return item.value !== '454045' ? (
                                        <MenuItem value={item.value} key={index}>
                                            {item.text}
                                        </MenuItem>
                                    ) : null;
                                })}
                            </Select>
                            {!!grantAgencyName && grantAgencyName.trim().length > 0 && !grantAgencyType && (
                                <FormHelperText
                                    id="rek-grant-agency-helper-text"
                                    data-testid="rek-grant-agency-helper-text"
                                    error
                                >
                                    {validationLocale.validationErrors.required}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Button
                        id={(!!grantSelectedToEdit && 'rek-grant-update') || 'rek-grant-add'}
                        data-analyticsid={(!!grantSelectedToEdit && 'rek-grant-update') || 'rek-grant-add'}
                        data-testid={(!!grantSelectedToEdit && 'rek-grant-update') || 'rek-grant-add'}
                        variant="contained"
                        fullWidth
                        color="primary"
                        disabled={
                            disabled ||
                            !grantAgencyName ||
                            grantAgencyName.trim().length === 0 ||
                            (!hideType && !grantAgencyType)
                        }
                        onClick={_addGrant}
                    >
                        {(!!grantSelectedToEdit && editButton) || addButton}
                    </Button>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

GrantListEditorForm.propTypes = {
    disabled: PropTypes.bool,
    grantSelectedToEdit: PropTypes.object,
    hideType: PropTypes.bool,
    isPopulated: PropTypes.func.isRequired,
    locale: PropTypes.object,
    onAdd: PropTypes.func.isRequired,
    required: PropTypes.bool,
};

export default React.memo(GrantListEditorForm);
