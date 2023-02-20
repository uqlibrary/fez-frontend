import React from 'react';

import MenuItem from '@mui/material/MenuItem';

import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';

import { AUDIENCE_SIZE } from 'config/general';
import { default as componentsLocale } from 'locale/components';

const AudienceSizeField = fieldProps => {
    const fieldLocale = componentsLocale.components.audienceSizeField;
    return (
        <SelectField
            disabled={fieldProps.submitting}
            label={fieldLocale.label}
            name={'audienceSize'}
            selectFieldId="rek-audience-size"
            {...fieldProps}
        >
            {AUDIENCE_SIZE.map(item => (
                <MenuItem key={item.value} value={item.value}>
                    {item.text}
                </MenuItem>
            ))}
        </SelectField>
    );
};

export default AudienceSizeField;
