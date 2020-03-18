import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { AFFILIATION_TYPE_NOT_UQ, AFFILIATION_TYPE_UQ } from 'config/general';

export default function OrgAffilicationTypeSelector({ affiliation, onAffiliationChange, locale, error, disabled }) {
    return (
        <FormControl fullWidth error={error}>
            <InputLabel id="org-affiliation-selector-label">{locale.inputLabel}</InputLabel>
            <Select
                value={affiliation}
                name="org-affiliation-selector"
                onChange={onAffiliationChange}
                required
                disabled={disabled}
                labelId="org-affiliation-selector-label"
                SelectDisplayProps={{
                    id: 'org-affiliation-selector',
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

OrgAffilicationTypeSelector.defaultProps = {
    locale: {
        inputLabel: 'Org affiliation',
        placeholder: 'Organisational affiliation at time of publication',
        options: [{ key: AFFILIATION_TYPE_UQ, value: 'UQ' }, { key: AFFILIATION_TYPE_NOT_UQ, value: 'Not UQ' }],
    },
    error: false,
    helperText: undefined,
};
