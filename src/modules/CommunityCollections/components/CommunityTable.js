import React from 'react';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CommunityDataRow from './CommunityDataRow';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from 'actions';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    dateCell: {
        minWidth: 120,
    },
    checkBoxCell: {
        maxWidth: 10,
        paddingRight: 0,
        width: 10,
    },
});
export const CommunityTable = ({ records, labels, conf, autoCollapse, adminUser }) => {
    const communitiesSelected = useSelector(state => state.get('viewCommunitiesReducer').communitiesSelected);
    const dispatch = useDispatch();
    const classes = useStyles();

    const onSelectAllChange = e => {
        if (!e.target.checked) {
            dispatch(actions.setAllCommunitiesSelected({ pids: [] }));
        } else {
            const allRecords = [];
            records.map(record => {
                allRecords.push(record.rek_pid);
            });
            dispatch(actions.setAllCommunitiesSelected({ pids: allRecords }));
        }
    };
    return (
        <TableContainer component={Paper} style={{ margin: 0, padding: 0 }}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow data-testid="community-collections-primary-header">
                        <TableCell className={classes.checkBoxCell}>
                            <Checkbox
                                color="primary"
                                indeterminate={
                                    communitiesSelected.length > 0 && communitiesSelected.length < records.length
                                }
                                checked={records.length > 0 && communitiesSelected.length === records.length}
                                onChange={onSelectAllChange}
                                inputProps={{
                                    'aria-label': 'select all rows',
                                }}
                            />
                        </TableCell>
                        <TableCell className={classes.checkBoxCell} />
                        <TableCell>{labels.title}</TableCell>
                        <TableCell className={classes.dateCell} align="right">
                            {labels.creation_date}
                        </TableCell>
                        <TableCell className={classes.dateCell} align="right">
                            {labels.updated_date}
                        </TableCell>
                        {!!adminUser && <TableCell align="right">{labels.actions}</TableCell>}
                    </TableRow>
                </TableHead>

                <TableBody data-testid="community-collections-primary-body">
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
    adminUser: PropTypes.bool,
};
export default CommunityTable;
