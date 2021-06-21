import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import ViewField from './ViewField';

export const ViewRow = ({ fields }) => {
    return (
        <Grid container>
            {fields.map(field => (
                <Grid item xs={12 / fields.length}>
                    <ViewField
                        key={`${field.fieldId}`}
                        fieldConfig={field}
                        headerColumnWidth={(12 * fields.length) / 4}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

ViewRow.propTypes = {
    fields: PropTypes.array,
};

export default React.memo(ViewRow);
