import React from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import AdminActions from './AdminActions';
import * as actions from 'actions';
import makeStyles from '@mui/styles/makeStyles';
import { parseHtmlToJSX } from 'helpers/general';
import { pathConfig } from 'config';
import CollectionsListEmbedded from './CollectionsListEmbedded';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';

import { communityCollectionsConfig } from 'config';
const moment = require('moment');

const returnDateField = (date, conf, className) => {
    return (
        <Grid item xs={2} className={className} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography variant="body2">
                {moment(date)
                    .local()
                    .format(conf.dateFormat)}
            </Typography>
        </Grid>
    );
};

import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    rowParent: {
        boxSizing: 'border-box',
        boxShadow: '0 -1px 0 #eaeaea',
        padding: '15px 0px 0px',
    },
    rowChild: {
        paddingBottom: 10,
    },
    padTop: {
        paddingTop: 5,
    },
    padTopLarge: {
        paddingTop: 10,
    },
    expandButton: {
        float: 'left',
        width: 24,
    },
    title: {
        float: 'right',
        width: 'calc(100% - 30px)',
        paddingTop: 10,
        paddingBottom: 5,
    },
    italic: {
        fontStyle: 'italic',
    },
    rightAlign: {
        textAlign: 'center',
    },
    dateField: { paddingTop: 5 },
});

export const CommunityDataRow = ({ conf, row, adminUser, labels, autoCollapse }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const collectionsOpen = useSelector(state => state.get('viewCollectionsReducer').collectionsOpened);

    const open = collectionsOpen.indexOf(row.rek_pid) > -1;

    const handleSetOpen = openState => {
        if (autoCollapse) {
            dispatch(actions.clearCCCollectionsList());
        }
        dispatch(actions.setCollectionsArray({ pid: row.rek_pid, open: openState }));
    };

    return (
        <Grid container key={row.rek_pid} data-testid={`row-${row.rek_pid}`} className={classes.rowParent}>
            <React.Fragment key={row.rek_pid}>
                <Grid container className={classes.rowChild}>
                    <Grid item xs={10} sm={11} md={adminUser ? 7 : 8}>
                        <div className={classes.expandButton}>
                            <IconButton
                                className={classes.padTop}
                                aria-label="expand row"
                                size="small"
                                onClick={() => handleSetOpen(!open)}
                                id={`expand-row-${row.rek_pid}`}
                                data-analyticsid={`expand-row-${row.rek_pid}`}
                                data-testid={`expand-row-${row.rek_pid}`}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </div>{' '}
                        <div className={classes.title}>
                            <Typography variant="body2">
                                <Link
                                    to={pathConfig.records.view(row.rek_pid)}
                                    id={`community-title-${row.rek_pid}`}
                                    data-testid={`community-title-${row.rek_pid}`}
                                >
                                    {parseHtmlToJSX(row.rek_title)}
                                </Link>
                            </Typography>
                            {!!row.rek_description && <Typography variant="caption">{row.rek_description}</Typography>}
                            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                                <Typography variant="caption" className={classes.italic}>
                                    {communityCollectionsConfig.formatCreationDate(
                                        moment(row.rek_created_date)
                                            .local()
                                            .format(conf.dateFormat),
                                    )}
                                    <Box sx={{ display: { xs: 'inline', sm: 'none' } }} component="span">
                                        <br />
                                    </Box>
                                    <Typography
                                        sx={{ display: { xs: 'none', sm: 'inline' } }}
                                        component="span"
                                        variant="caption"
                                        className={classes.italic}
                                    >
                                        {' / '}
                                    </Typography>
                                    {communityCollectionsConfig.formatUpdatedDate(
                                        moment(row.rek_updated_date)
                                            .local()
                                            .format(conf.dateFormat),
                                    )}
                                </Typography>
                            </Box>
                        </div>
                        <div style={{ clear: 'both' }} />
                    </Grid>
                    {returnDateField(row.rek_created_date, conf, `${classes.datefield} ${classes.padTopLarge}`)}
                    {returnDateField(row.rek_updated_date, conf, `${classes.datefield} ${classes.padTopLarge}`)}
                    {!!adminUser && (
                        <Grid item xs={2} sm={1} className={classes.rightAlign}>
                            <AdminActions
                                record={row.rek_pid}
                                id={`admin-actions-${row.rek_pid}`}
                                data-testid={`admin-actions-${row.rek_pid}`}
                            />
                        </Grid>
                    )}
                </Grid>
                {!!open && (
                    <Grid container>
                        <Grid item xs={12}>
                            <CollectionsListEmbedded
                                title={row.rek_title}
                                key={row.rek_pid}
                                pid={row.rek_pid}
                                labels={labels}
                                conf={conf}
                                adminUser={adminUser}
                                open={open}
                            />
                        </Grid>
                    </Grid>
                )}
            </React.Fragment>
        </Grid>
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
