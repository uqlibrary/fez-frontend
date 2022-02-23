import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useIsUserSuperAdmin } from 'hooks';
import { pathConfig } from 'config';
import ReactHtmlParser from 'react-html-parser';
import AdminActions from './AdminActions';
import PropTypes from 'prop-types';
import CollectionsListEmbedded from './CollectionsListEmbedded';
const moment = require('moment');

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    dateCell: {
        minWidth: 120,
    },
});
export const CommunityTable = ({ records, labels, conf }) => {
    const isSuperAdmin = useIsUserSuperAdmin();
    const classes = useStyles();
    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow data-testid="community-collections-primary-header">
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
                        <>
                            <TableRow key={row.rek_pid} data-testid={`row-${row.rek_pid}`}>
                                <TableCell component="th" scope="row">
                                    <Typography variant="body2">
                                        <Link to={pathConfig.records.view(row.rek_pid)}>
                                            {ReactHtmlParser(row.rek_title)}
                                        </Link>
                                        {/* <a href={`#/view/${row.rek_pid}`}>{row.rek_title}</a> */}
                                    </Typography>
                                    {!!row.rek_description && (
                                        <Typography variant="caption">{row.rek_description}</Typography>
                                    )}
                                </TableCell>
                                <TableCell align="right" className={classes.dateCell}>
                                    {moment(row.rek_created_date)
                                        .local()
                                        .format(conf.dateFormat)}
                                </TableCell>
                                <TableCell align="right" className={classes.dateCell}>
                                    {moment(row.rek_updated_date)
                                        .local()
                                        .format(conf.dateFormat)}
                                </TableCell>
                                {!!isSuperAdmin && (
                                    <TableCell align="right">
                                        <AdminActions record={row.rek_pid} />
                                    </TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <CollectionsListEmbedded
                                    pid={row.rek_pid}
                                    labels={labels}
                                    conf={conf}
                                    isSuperAdmin={isSuperAdmin}
                                />
                            </TableRow>
                        </>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
CommunityTable.propTypes = {
    records: PropTypes.array,
    labels: PropTypes.object,
    conf: PropTypes.object,
};
export default CommunityTable;
