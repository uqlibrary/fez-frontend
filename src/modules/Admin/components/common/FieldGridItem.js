import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

import Grid from '@mui/material/Grid';
import { fieldConfig } from 'config/admin';
import { NTRO_SUBTYPES, NTRO_SUBTYPE_CW_TEXTUAL_WORK, SUBTYPE_NON_NTRO } from 'config/general';
import { useRecordContext } from 'context';

export const FieldGridItem = ({ field, group, disabled, ...props }) => {
    const { record } = useRecordContext();
    const form = useFormContext();
    if (!fieldConfig.default[field]) {
        console.warn('No field config found for', field);
        return '';
    }

    const componentProps = {
        ...fieldConfig.default[field].componentProps,
        ...(((fieldConfig.override[record.rek_display_type] || {})[field] || (() => {}))({
            isNtro:
                (NTRO_SUBTYPES.includes(record.rek_subtype) && record.rek_subtype !== NTRO_SUBTYPE_CW_TEXTUAL_WORK) ||
                props.isNtro ||
                false,
            isNonNtro: record.rek_subtype === SUBTYPE_NON_NTRO,
            isCreate: !record.rek_pid,
        }) || {}),
    };

    if (fieldConfig.default[field]?.isComposed) {
        const Component = fieldConfig.default[field]?.component;
        return (
            <Grid item xs={12} md={12 / group.length}>
                <Component disabled={disabled} {...componentProps} />
            </Grid>
        );
    }
    const error = form.getFieldState(componentProps.name).error;

    return (
        <Grid item xs={12} md={12 / group.length}>
            <Field
                name={componentProps.name}
                control={form.control}
                component={fieldConfig.default[field].component}
                disabled={disabled}
                {...componentProps}
                {...(!!error ? { error: true, errorText: error?.message || /* istanbul ignore next */ error } : {})}
                value={form.getValues(componentProps.name) ?? ''}
                {...props}
            />
        </Grid>
    );
};

FieldGridItem.propTypes = {
    field: PropTypes.string,
    group: PropTypes.array,
    disabled: PropTypes.bool,
    isNtro: PropTypes.bool,
    childrenItems: PropTypes.array,
};

export default FieldGridItem;
