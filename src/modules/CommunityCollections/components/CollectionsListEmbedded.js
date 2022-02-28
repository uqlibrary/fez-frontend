/* eslint-disable no-unused-vars */
import React from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import * as actions from 'actions';
import { useSelector, useDispatch } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { pathConfig } from 'config';
import ReactHtmlParser from 'react-html-parser';
import AdminActions from './AdminActions';
import PropTypes from 'prop-types';
import Collapse from '@material-ui/core/Collapse';
const moment = require('moment');

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    dateCell: {
        minWidth: 120,
    },
});
export const CollectionsListEmbedded = ({ pid, labels, conf, isSuperAdmin, open }) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (open) {
            dispatch(
                actions.loadCCCollectionsList({
                    pid: pid,
                    pageSize: 10,
                    page: 1,
                    direction: 'Asc',
                    sortBy: 'title',
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const collectionList = useSelector(state => state.get('viewCollectionsReducer').collectionList);
    const classes = useStyles();

    const filteredData = collectionList.filter(obj => obj.parent === pid);
    const finalList = filteredData.length > 0 ? filteredData[0].data : [];

    return (
        <>
            <TableCell colSpan={4}>
                {!!finalList.data && finalList.data.length > 0 && (
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box>
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
                                    {finalList.data.map(row => (
                                        <TableRow key={row.rek_pid} data-testid={`row-${row.rek_pid}`}>
                                            <TableCell component="th" scope="row">
                                                <Typography variant="body2">
                                                    <Link to={pathConfig.records.view(row.rek_pid)}>
                                                        {ReactHtmlParser(row.rek_title)}
                                                    </Link>
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
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                )}
            </TableCell>
        </>
    );
};
CollectionsListEmbedded.propTypes = {
    records: PropTypes.array,
    labels: PropTypes.object,
    conf: PropTypes.object,
    isSuperAdmin: PropTypes.bool,
    pid: PropTypes.string,
    open: PropTypes.bool,
};
export default CollectionsListEmbedded;
