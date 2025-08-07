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
    const config = fieldConfig.default[field];
    if (!config) {
        console.warn('No field config found for', field);
        return '';
    }

    if (config.composed) {
        // add disable, error and errorText props to each component props
        Object.keys(config.componentProps).forEach(k => {
            config.componentProps[k].disabled = disabled;
            const error = methods.getFieldState(config.componentProps[k].name).error;
            if (error) {
                config.componentProps[k].error = true;
                config.componentProps[k].errorText = error;
            }
        });
        return (
            <Grid item xs={12} md={12 / group.length}>
                <config.component {...config.componentProps} disabled={disabled} />
            </Grid>
        );
    }

    const componentProps = {
        ...config.componentProps,
        ...(((fieldConfig.override[jnlDisplayType] || {})[field] || (() => {}))({}) || {}),
    };
    const error = methods.getFieldState(componentProps.name).error;
    return (
        <Grid item xs={12} md={12 / group.length}>
            <Field
                name={componentProps.name}
                control={methods.control}
                component={config.component}
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
