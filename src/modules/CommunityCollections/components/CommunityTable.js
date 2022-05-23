import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CommunityDataRow from './CommunityDataRow';
import { Grid } from '@material-ui/core';
import { Hidden } from '@material-ui/core';
const useStyles = makeStyles({
    headerStyle: {
        fontWeight: 400,
    },
    collapseIcon: {
        float: 'left',
        width: 24,
    },
    title: {
        float: 'right',
        width: 'calc(100% - 30px)',
    },
    dataRow: {
        paddingTop: 10,
    },
});
export const CommunityTable = ({ records, labels, conf, autoCollapse, adminUser }) => {
    const classes = useStyles();
    return (
        <Grid container spacing={0}>
            {/* Header Row */}
            <Grid
                container
                spacing={0}
                className={classes.headerStyle}
                data-testid="community-collections-primary-header"
            >
                <Grid item xs={10} sm={11} md={adminUser ? 7 : 8}>
                    <div className={classes.collapseIcon} />
                    <div className={classes.title}>{labels.title}</div>
                </Grid>
                <Hidden smDown>
                    <Grid item xs={2}>
                        {labels.creation_date}
                    </Grid>
                    <Grid item xs={2}>
                        {labels.updated_date}
                    </Grid>
                </Hidden>
                {!!adminUser && (
                    <Grid item xs={2} sm={1}>
                        {labels.actions}
                    </Grid>
                )}
            </Grid>
            {/* Data Row */}
            <Grid container className={classes.dataRow} data-testid="community-collections-primary-body">
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
