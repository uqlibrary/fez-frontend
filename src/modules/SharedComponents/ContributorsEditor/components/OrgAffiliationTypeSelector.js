import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { AFFILIATION_TYPE_NOT_UQ, AFFILIATION_TYPE_UQ } from 'config/general';

export default function OrgAffilicationTypeSelector({
    affiliation,
    onAffiliationChange,
    locale = {
        inputLabel: 'Org affiliation',
        placeholder: 'Organisational affiliation at time of publication',
        options: [
            { key: AFFILIATION_TYPE_UQ, value: 'UQ' },
            { key: AFFILIATION_TYPE_NOT_UQ, value: 'Not UQ' },
        ],
    },
    error = false,
    disabled,
}) {
    return (
        <FormControl variant="standard" fullWidth error={error}>
            <InputLabel id="org-affiliation-label" data-testid="org-affiliation-label">
                {locale.inputLabel}
            </InputLabel>
            <Select
                variant="standard"
                value={affiliation}
                name="org-affiliation"
                onChange={onAffiliationChange}
                required
                disabled={disabled}
                labelId="org-affiliation-label"
                SelectDisplayProps={{
                    id: 'org-affiliation-select',
                    'data-testid': 'org-affiliation-select',
                }}
                MenuProps={{
                    id: 'org-affiliation-options',
                    'data-analyticsid': 'org-affiliation-options',
                    'data-testid': 'org-affiliation-options',
                }}
            >
                <MenuItem value="" disabled>
                    {locale.placeholder}
                </MenuItem>
                {locale.options.map(option => (
                    <MenuItem value={option.key} key={option.key}>
                        {option.value}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

OrgAffilicationTypeSelector.propTypes = {
    affiliation: PropTypes.string,
    onAffiliationChange: PropTypes.func.isRequired,
    locale: PropTypes.object,
    required: PropTypes.bool,
    error: PropTypes.bool,
    disabled: PropTypes.bool,
    helperText: PropTypes.any,
};
