import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import Grid from '@mui/material/Grid';

import { useJournalContext } from 'context';
import { fieldConfig } from 'config/journalAdmin';

export const FieldGridItem = ({ field, group, disabled }) => {
    const { jnlDisplayType } = useJournalContext();
    if (!fieldConfig.default[field]) {
        console.warn('No field config found for', field);
        return '';
    }

    const componentProps = {
        ...fieldConfig.default[field].componentProps,
        ...(((fieldConfig.override[jnlDisplayType] || {})[field] || (() => {}))({}) || {}),
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
