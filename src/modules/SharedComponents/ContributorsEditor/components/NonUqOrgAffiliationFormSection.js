import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { ORG_AFFILIATION_TYPES } from 'config/general';

export default function NonUqOrgAffiliationFormSection({
    orgAffiliation,
    orgType,
    onOrgAffiliationChange,
    onOrgTypeChange,
    locale,
    disableAffiliationEdit,
    disableOrgTypeEdit,
    orgAffiliationError,
    orgAffiliationTypeError,
    fullWidthFields,
}) {
    const options = ORG_AFFILIATION_TYPES.map(option => {
        return option.value !== '454045' ? (
            <MenuItem value={option.value} key={option.value}>
                {option.text}
            </MenuItem>
        ) : null;
    });

    return (
        <Grid container spacing={1}>
            <Grid item xs={fullWidthFields ? 12 : 6} sm={6}>
                <TextField
                    required
                    fullWidth
                    value={orgAffiliation}
                    onChange={onOrgAffiliationChange}
                    label={locale.fields.organisation.inputLabel}
                    placeholder={locale.fields.organisation.placeholder}
                    disabled={disableAffiliationEdit}
                    error={orgAffiliationError}
                    id="org-affiliation-name"
                />
            </Grid>
            <Grid item xs={fullWidthFields ? 12 : 6} sm={6}>
                <FormControl required fullWidth error={orgAffiliationTypeError}>
                    <InputLabel id="org-affiliation-type-label">{locale.fields.organisationType.inputLabel}</InputLabel>
                    <Select
                        value={orgType}
                        name="org-affiliation-type"
                        onChange={onOrgTypeChange}
                        disabled={disableOrgTypeEdit}
                        labelId="org-affiliation-type-label"
                        SelectDisplayProps={{
                            id: 'org-affiliation-type',
                        }}
                    >
                        <MenuItem disabled>{locale.fields.organisationType.placeholder}</MenuItem>
                        {options}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
}

NonUqOrgAffiliationFormSection.propTypes = {
    orgAffiliation: PropTypes.string,
    orgType: PropTypes.string,
    onOrgAffiliationChange: PropTypes.func,
    onOrgTypeChange: PropTypes.func,
    locale: PropTypes.object,
    disableAffiliationEdit: PropTypes.bool,
    disableOrgTypeEdit: PropTypes.bool,
    orgAffiliationError: PropTypes.bool,
    orgAffiliationTypeError: PropTypes.bool,
    fullWidthFields: PropTypes.bool,
};

NonUqOrgAffiliationFormSection.defaultProps = {
    locale: {
        fields: {
            organisation: {
                inputLabel: 'Organisation',
                placeholder: 'Primary organisation affiliation',
            },
            organisationType: {
                inputLabel: 'Organisation type',
                placeholder: 'Select an affiliated organisation type',
            },
        },
    },
};
