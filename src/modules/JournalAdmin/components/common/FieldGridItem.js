import React from 'react';
import PropTypes from 'prop-types';

import { useFormContext } from 'react-hook-form';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

import Grid from '@mui/material/Grid';

import { useJournalContext } from 'context';
import { fieldConfig } from 'config/journalAdmin';

export const FieldGridItem = ({ field, group, disabled }) => {
    const { jnlDisplayType } = useJournalContext();
    const methods = useFormContext();
    if (!fieldConfig.default[field]) {
        console.warn('No field config found for', field);
        return '';
    }

    const componentProps = {
        ...fieldConfig.default[field].componentProps,
        ...(((fieldConfig.override[jnlDisplayType] || {})[field] || (() => {}))({}) || {}),
    };
    const error = methods.getFieldState(componentProps.name).error;

    return (
        <Grid item xs={12} md={12 / group.length}>
            <Field
                name={componentProps.name}
                control={methods.control}
                component={fieldConfig.default[field].component}
                disabled={disabled}
                {...componentProps}
                {...(!!error ? { error: true, errorText: error } : {})}
                value={methods.getValues(componentProps.name) ?? ''}
            />
        </Grid>
    );
};

FieldGridItem.propTypes = {
    field: PropTypes.string,
    group: PropTypes.array,
    disabled: PropTypes.bool,
    childrenItems: PropTypes.array,
};

export default FieldGridItem;
