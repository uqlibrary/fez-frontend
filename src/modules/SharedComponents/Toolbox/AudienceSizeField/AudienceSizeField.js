import React from 'react';
import { Field } from 'redux-form/immutable';

import MenuItem from '@material-ui/core/MenuItem';

import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';

import { AUDIENCE_SIZE } from 'config/general';
import { default as componentsLocale } from 'locale/components';

const AudienceSizeField = fieldProps => {
    const fieldLocale = componentsLocale.components.audienceSizeField;
    return (
        <Field
            component={SelectField}
            disabled={fieldProps.submitting}
            label={fieldLocale.label}
            name={'audienceSize'}
            SelectDisplayProps={{
                id: 'audienceSize',
            }}
            {...fieldProps}
        >
            {AUDIENCE_SIZE.map(item => (
                <MenuItem key={item.value} value={item.value}>
                    {item.text}
                </MenuItem>
            ))}
        </Field>
    );
};

export default AudienceSizeField;
