import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import AdminActions from './AdminActions';
import { makeStyles } from '@material-ui/core/styles';
import ReactHtmlParser from 'react-html-parser';
import { pathConfig } from 'config';
import CollectionsListEmbedded from './CollectionsListEmbedded';
import { useDispatch } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import * as actions from 'actions';
const moment = require('moment');

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    dateCell: {
        minWidth: 120,
    },
});
import { Link } from 'react-router-dom';

export const CommunityDataRow = ({ conf, row, isSuperAdmin, labels }) => {
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    const handleSetOpen = openState => {
        /* I can fire the component get data here */
        if (openState) {
            dispatch(
                actions.loadCCCollectionsList({
                    pid: row.rek_pid,
                    pageSize: 10,
                    page: 1,
                    direction: 'Asc',
                    sortBy: 'title',
                }),
            );
        }
        setOpen(openState);
    };

    const classes = useStyles();
    return (
        <React.Fragment key={row.rek_pid}>
            <TableRow key={row.rek_pid} data-testid={`row-${row.rek_pid}`}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => handleSetOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Typography variant="body2">
                        <Link to={pathConfig.records.view(row.rek_pid)}>{ReactHtmlParser(row.rek_title)}</Link>
                    </Typography>
                    {!!row.rek_description && <Typography variant="caption">{row.rek_description}</Typography>}
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
            {!!open && (
                <TableRow>
                    <CollectionsListEmbedded
                        key={row.rek_pid}
                        pid={row.rek_pid}
                        labels={labels}
                        conf={conf}
                        isSuperAdmin={isSuperAdmin}
                        open={open}
                    />
                </TableRow>
            )}
        </React.Fragment>
    );
};
CommunityDataRow.propTypes = {
    conf: PropTypes.object,
    row: PropTypes.object,
    isSuperAdmin: PropTypes.bool,
    labels: PropTypes.object,
};
export default CommunityDataRow;
