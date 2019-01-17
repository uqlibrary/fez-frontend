import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {orgAffiliationTypes} from 'config/general';

export default function NonUqOrgAffiliationFormSection({orgAffiliation, orgType, onOrgAffiliationChange, onOrgTypeChange, locale}) {
    const options = orgAffiliationTypes.map(option => (
        <MenuItem value={option.value} key={option.value}>{option.text}</MenuItem>
    ));

    return (
        <Grid container spacing={8}>
            <Grid item xs={6}>
                <TextField
                    required
                    fullWidth
                    value={orgAffiliation}
                    onChange={onOrgAffiliationChange}
                    label={locale.fields.organisation.inputLabel}
                />
            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>{locale.fields.organisationType.inputLabel}</InputLabel>
                    <Select
                        value={orgType}
                        onChange={onOrgTypeChange}
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
    locale: PropTypes.object
};

NonUqOrgAffiliationFormSection.defaultProps = {
    locale: {
        fields: {
            organisation: {
                inputLabel: 'Organisation'
            },
            organisationType: {
                inputLabel: 'Organisation type',
                placeholder: 'Select an organisation type',
            }
        }
    }
};
