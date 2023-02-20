import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import Grid from '@mui/material/Grid';
import { fieldConfig } from 'config/admin';
import { NTRO_SUBTYPES, NTRO_SUBTYPE_CW_TEXTUAL_WORK, SUBTYPE_NON_NTRO } from 'config/general';
import { useRecordContext, useFormValuesContext } from 'context';

export const FieldGridItem = ({ field, group, disabled }) => {
    const { record } = useRecordContext();
    const { formValues } = useFormValuesContext();

    if (!fieldConfig.default[field]) {
        console.warn('No field config found for', field);
        return '';
    }

    const componentProps = {
        ...fieldConfig.default[field].componentProps,
        ...(((fieldConfig.override[record.rek_display_type] || {})[field] || (() => {}))({
            isNtro:
                (NTRO_SUBTYPES.includes(record.rek_subtype) && record.rek_subtype !== NTRO_SUBTYPE_CW_TEXTUAL_WORK) ||
                formValues.isNtro ||
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

    return (
        <Grid item xs={12} md={12 / group.length}>
            <Field disabled={disabled} component={fieldConfig.default[field].component} {...componentProps} />
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
