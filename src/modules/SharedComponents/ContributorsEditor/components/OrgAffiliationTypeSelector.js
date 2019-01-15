import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default function OrgAffilicationTypeSelector({affiliation, onAffiliationChange, locale, error}) {
    return (
        <FormControl fullWidth>
            <InputLabel>{locale.inputLabel}</InputLabel>
            <Select
                value={affiliation}
                onChange={onAffiliationChange}
                error={error}
                required
            >
                <MenuItem value="" disabled>{locale.placeholder}</MenuItem>
                {
                    locale.options.map((option) => <MenuItem value={option.key} key={option.key}>{option.value}</MenuItem>)
                }
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
    helperText: PropTypes.any
};

OrgAffilicationTypeSelector.defaultProps = {
    locale: {
        inputLabel: 'Org affiliation',
        placeholder: 'Organisational affiliation at time of publication',
        options: [
            {key: 'UQ', value: 'UQ'},
            {key: 'NotUQ', value: 'Not UQ'}
        ]
    },
    error: false,
    helperText: undefined
};
