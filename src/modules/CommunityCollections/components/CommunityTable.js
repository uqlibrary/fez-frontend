/* eslint-disable no-unused-vars */
import React from 'react';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CommunityDataRow from './CommunityDataRow';
import { leftJoin } from 'helpers/general';
import { Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    tableHead: {
        width: '100%',
    },
    tableHeadCell: {
        fontWeight: 500,
    },
    dateCell: {
        minWidth: 120,
        width: '20%',
        float: 'left',
    },
    titleCell: {
        display: 'block',
        width: '50%',
        float: 'left',
    },
    actions: {
        float: 'left',
        fontWeight: 'bold',
    },
});
export const CommunityTable = ({ records, labels, conf, autoCollapse, adminUser }) => {
    const classes = useStyles();
    return (
        <Grid container spacing={0}>
            {/* Header Row */}
            <Grid container spacing={0} style={{ fontWeight: 400 }}>
                <Grid item xs={adminUser ? 7 : 8}>
                    <div style={{ float: 'left', width: 24 }} />
                    <div style={{ float: 'right', width: 'calc(100% - 30px' }}>{labels.title}</div>
                </Grid>
                <Grid item xs={2}>
                    {labels.creation_date}
                </Grid>
                <Grid item xs={2}>
                    {labels.updated_date}
                </Grid>
                {!!adminUser && (
                    <Grid item xs={1}>
                        {labels.actions}
                    </Grid>
                )}
            </Grid>
            {/* Data Row */}
            <Grid container style={{ paddingTop: 10 }}>
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

        // <TableContainer component={Paper} style={{ margin: 0, padding: 0 }}>
        //     <Table aria-label="simple table">
        //         <TableHead>
        //             <TableRow data-testid="community-collections-primary-header">
        //                 <TableCell />
        //                 <TableCell>{labels.title}</TableCell>
        //                 <TableCell className={classes.dateCell}>{labels.creation_date}</TableCell>
        //                 <TableCell className={classes.dateCell}>{labels.updated_date}</TableCell>
        //                 {!!adminUser && <TableCell>{labels.actions}</TableCell>}
        //             </TableRow>
        //         </TableHead>

        //         <TableBody data-testid="community-collections-primary-body">
        //             {records.map(row => (
        //                 <CommunityDataRow
        //                     key={row.rek_pid}
        //                     conf={conf}
        //                     row={row}
        //                     adminUser={adminUser}
        //                     labels={labels}
        //                     autoCollapse={autoCollapse}
        //                 />
        //             ))}
        //         </TableBody>
        //     </Table>
        // </TableContainer>
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
