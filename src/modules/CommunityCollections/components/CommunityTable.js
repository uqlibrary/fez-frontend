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
                <Grid item xs={6} md={adminUser ? 7 : 8}>
                    <Box sx={{ float: 'left', width: '24px' }} />
                    <Box sx={{ float: 'right', width: 'calc(100% - 30px)' }}>{labels.title}</Box>
                </Grid>
                <Grid item xs={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                    {labels.creation_date}
                </Grid>
                <Grid item xs={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                    {labels.updated_date}
                </Grid>
                {!!adminUser && (
                    <Grid item xs={6} md={1} sx={{ textAlign: 'right' }}>
                        {labels.actions}
                    </Grid>
                )}
            </Grid>
            {/* Data Row */}
            <Grid container sx={{ paddingTop: '10px' }} data-testid="community-collections-primary-body">
                {records.map(row => (
                    <CommunityDataRow
                        key={row.rek_pid}
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
