import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { RelatedDatasetAndPublicationListField } from './RelatedDatasetAndPublicationListField';

const isDirty = (prev, current) =>
    JSON.stringify(prev?.map?.(i => i?.rek_isderivationof?.id)) !==
    JSON.stringify(current?.map?.(i => i?.rek_isderivationof));

export const RelatedPublicationListField = fieldProps => (
    <>
        {isDirty(fieldProps.state?.defaultValue, fieldProps?.value) && (
            <Grid sx={{ my: 2 }}>
                <Typography>
                    Note: related publications are automatically (un)linked back to parent records. This process is not
                    instant, please expect delays during busy times. A system alert will be raised in case the process
                    fails.
                </Typography>
            </Grid>
        )}
        <RelatedDatasetAndPublicationListField {...fieldProps} />
    </>
);
