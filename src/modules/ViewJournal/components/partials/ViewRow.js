import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/GridLegacy';
import ViewField from './ViewField';

export const ViewRow = ({ viewRowId, fields }) => {
    return (
        <Grid container id={viewRowId} data-testid={viewRowId}>
            {fields.map((field, index) => (
                <Grid
                    key={`${field.fieldId}`}
                    item
                    xs={12 / fields.length}
                    id={`${viewRowId}-item-${index}`}
                    data-testid={`${viewRowId}-item-${index}`}
                >
                    <ViewField fieldConfig={field} headerColumnWidth={(12 * fields.length) / 4} />
                </Grid>
            ))}
        </Grid>
    );
};

ViewRow.propTypes = {
    fields: PropTypes.array,
    viewRowId: PropTypes.string,
};

export default React.memo(ViewRow);
