/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';

import { useFormContext, Controller } from 'react-hook-form';

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

    const Field = fieldConfig.default[field].component;

    return (
        <Grid item xs={12} md={12 / group.length}>
            <Controller
                render={({ field }) => {
                    return (
                        <Field
                            {...field}
                            disabled={disabled}
                            {...componentProps}
                            {...(!!componentProps.noRef ? { ref: null } : {})}
                            value={methods.getValues(componentProps.name)}
                        />
                    );
                }}
                name={componentProps.name}
                control={methods.control}
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
