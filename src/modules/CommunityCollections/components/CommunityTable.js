import React from 'react';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { useIsUserSuperAdmin } from 'hooks';
import PropTypes from 'prop-types';
import CommunityDataRow from './CommunityDataRow';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    dateCell: {
        minWidth: 120,
    },
});
export const CommunityTable = ({ records, labels, conf, autoCollapse }) => {
    const isSuperAdmin = useIsUserSuperAdmin();
    const classes = useStyles();
    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow data-testid="community-collections-primary-header">
                        <TableCell />
                        <TableCell>{labels.title}</TableCell>
                        <TableCell className={classes.dateCell} align="right">
                            {labels.creation_date}
                        </TableCell>
                        <TableCell className={classes.dateCell} align="right">
                            {labels.updated_date}
                        </TableCell>
                        {!!isSuperAdmin && <TableCell align="right">{labels.actions}</TableCell>}
                    </TableRow>
                </TableHead>

                <TableBody data-testid="community-collections-primary-body">
                    {records.map(row => (
                        <CommunityDataRow
                            key={row.rek_pid}
                            conf={conf}
                            row={row}
                            isSuperAdmin={isSuperAdmin}
                            labels={labels}
                            autoCollapse={autoCollapse}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
CommunityTable.propTypes = {
    records: PropTypes.array,
    location: PropTypes.object,
    labels: PropTypes.object,
    conf: PropTypes.object,
    autoCollapse: PropTypes.bool,
};
export default CommunityTable;
