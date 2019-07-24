import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';
import { fieldConfig } from 'config';

export const FieldGridItem = ({ field, group, disabled }) => (
    <Grid item xs={12 / group.length}>
        {!!fieldConfig[field].beforeComponent && fieldConfig[field].beforeComponent()}
        <Field disabled={disabled} component={fieldConfig[field].component} {...fieldConfig[field].componentProps} />
    </Grid>
);

FieldGridItem.propTypes = {
    field: PropTypes.string,
    group: PropTypes.array,
    disabled: PropTypes.bool,
    childrenItems: PropTypes.array
};
