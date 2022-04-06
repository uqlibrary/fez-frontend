import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import AdminActions from './AdminActions';
import * as actions from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import ReactHtmlParser from 'react-html-parser';
import { pathConfig } from 'config';
import CollectionsListEmbedded from './CollectionsListEmbedded';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useSelector, useDispatch } from 'react-redux';

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

export const CommunityDataRow = ({ conf, row, adminUser, labels, autoCollapse }) => {
    const dispatch = useDispatch();
    const collectionsOpen = useSelector(state => state.get('viewCollectionsReducer').collectionsOpened);

    const open = collectionsOpen.indexOf(row.rek_pid) > -1;

    const handleSetOpen = openState => {
        if (autoCollapse) {
            dispatch(actions.clearCCCollectionsList());
        }
        dispatch(actions.setCollectionsArray({ pid: row.rek_pid, open: openState }));
    };

    const classes = useStyles();
    return (
        <React.Fragment key={row.rek_pid}>
            <TableRow key={row.rek_pid} data-testid={`row-${row.rek_pid}`}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleSetOpen(!open)}
                        id={`expand-row-${row.rek_pid}`}
                        data-testid={`expand-row-${row.rek_pid}`}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Typography variant="body2">
                        <Link to={pathConfig.records.view(row.rek_pid)}>{ReactHtmlParser(row.rek_title)}</Link>
                    </Typography>
                    {!!row.rek_description && <Typography variant="caption">{row.rek_description}</Typography>}
                </TableCell>
                <TableCell className={classes.dateCell}>
                    {moment(row.rek_created_date)
                        .local()
                        .format(conf.dateFormat)}
                </TableCell>
                <TableCell className={classes.dateCell}>
                    {moment(row.rek_updated_date)
                        .local()
                        .format(conf.dateFormat)}
                </TableCell>
                {!!adminUser && (
                    <TableCell>
                        <AdminActions record={row.rek_pid} />
                    </TableCell>
                )}
            </TableRow>
            {!!open && (
                <TableRow>
                    <TableCell colSpan={6} style={{ padding: 0, margin: 0 }}>
                        <CollectionsListEmbedded
                            title={row.rek_title}
                            key={row.rek_pid}
                            pid={row.rek_pid}
                            labels={labels}
                            conf={conf}
                            adminUser={adminUser}
                            open={open}
                        />
                    </TableCell>
                </TableRow>
            )}
        </React.Fragment>
    );
};
CommunityDataRow.propTypes = {
    conf: PropTypes.object,
    row: PropTypes.object,
    adminUser: PropTypes.bool,
    labels: PropTypes.object,
    autoCollapse: PropTypes.bool,
};
export default CommunityDataRow;
