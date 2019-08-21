import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';
import { fieldConfig } from 'config/adminInterface';
import { NTRO_SUBTYPES } from 'config/general';
import { useRecordContext } from 'context';

export const FieldGridItem = ({ field, group, disabled }) => {
    const { record } = useRecordContext();
    return (
        <Grid item xs={12} md={12 / group.length}>
            <Field
                disabled={disabled}
                component={fieldConfig[field].component}
                {...fieldConfig[field].componentProps}
                isNtro={NTRO_SUBTYPES.includes(record.rek_subtype)}
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
