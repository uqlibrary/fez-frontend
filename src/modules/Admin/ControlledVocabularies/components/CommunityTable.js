import React from 'react';

import PropTypes from 'prop-types';
import CommunityDataRow from './CommunityDataRow';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export const CommunityTable = ({ records, labels, conf, autoCollapse, adminUser }) => {
    return (
        <Grid container spacing={0}>
            {/* Header Row */}
            <Grid container spacing={0} sx={{ fontWeight: 400 }} data-testid="community-collections-primary-header">
                <Grid item md={1} sx={1}>
                    {''}
                </Grid>
                <Grid item md={1} sx={{ display: { xs: 'none', md: 'block' } }}>
                    {labels.id}
                </Grid>
                <Grid item md={4}>
                    <Box sx={{ float: 'left', width: '24px' }} />
                    <Box sx={{ float: 'right', width: 'calc(100% - 30px)' }}>{labels.title}</Box>
                </Grid>
                <Grid item md={1} sx={{ display: { xs: 'none', md: 'block' } }}>
                    {labels.order}
                </Grid>
                <Grid item md={1} sx={{ display: { xs: 'none', md: 'block' } }}>
                    {labels.license}
                </Grid>
                <Grid item md={1} sx={{ display: { xs: 'none', md: 'block' } }}>
                    {labels.external_id}
                </Grid>
                <Grid item md={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                    {labels.path}
                </Grid>
                <Grid item md={1} xs={1} sx={{ textAlign: 'right' }}>
                    {labels.actions}
                </Grid>
            </Grid>
            {/* Data Row */}
            {console.log('records=', records)}
            <Grid container sx={{ paddingTop: '10px' }} data-testid="community-collections-primary-body">
                {records.map(row => (
                    <CommunityDataRow
                        key={row.cvo_id}
                        conf={conf}
                        row={row}
                        adminUser={adminUser}
                        labels={labels}
                        autoCollapse={autoCollapse}
                    />
                ))}
            </Grid>
        </Grid>
    );
};
CommunityTable.propTypes = {
    records: PropTypes.array,
    location: PropTypes.object,
    labels: PropTypes.object,
    conf: PropTypes.object,
    autoCollapse: PropTypes.bool,
    adminUser: PropTypes.bool,
};
export default CommunityTable;
