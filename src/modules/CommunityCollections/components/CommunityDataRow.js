import React from 'react';
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
import { Grid } from '@material-ui/core';
import { Hidden } from '@material-ui/core';
import { communityCollectionsConfig } from 'config';
const moment = require('moment');

const returnDateField = (date, conf, className) => {
    return (
        <Grid item xs={2} className={className}>
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
        outline: '1px solid #ededed',
        boxShadow: '0 -1px 0 #eaeaea',
        padding: '15px 0px 0px',
    },
    rowChild: {
        paddingBottom: 10,
    },
    padTop: {
        paddingTop: 5,
    },
    expandButton: {
        float: 'left',
        width: 24,
    },
    title: {
        float: 'right',
        width: 'calc(100% - 30px)',
        paddingTop: 5,
        paddingBottom: 5,
    },
    italic: {
        fontStyle: 'italic',
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
                    <Grid item xs={10} sm={11} md={adminUser ? 7 : 8} className={classes.outline}>
                        <div className={classes.expandButton}>
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => handleSetOpen(!open)}
                                id={`expand-row-${row.rek_pid}`}
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
                                    {ReactHtmlParser(row.rek_title)}
                                </Link>
                            </Typography>
                            {!!row.rek_description && <Typography variant="caption">{row.rek_description}</Typography>}
                            <Hidden mdUp>
                                <div>
                                    <Typography variant="caption" className={classes.italic}>
                                        {communityCollectionsConfig.formatCreationDate(
                                            moment(row.rek_created_date)
                                                .local()
                                                .format(conf.dateFormat),
                                        )}
                                        <Hidden smUp>
                                            <br />
                                        </Hidden>
                                        <Hidden xsDown> / </Hidden>
                                        {communityCollectionsConfig.formatUpdatedDate(
                                            moment(row.rek_updated_date)
                                                .local()
                                                .format(conf.dateFormat),
                                        )}
                                    </Typography>
                                </div>
                            </Hidden>
                        </div>
                        <div style={{ clear: 'both' }} />
                    </Grid>
                    <Hidden smDown>
                        {returnDateField(
                            row.rek_created_date,
                            conf,
                            `${classes.datefield} ${classes.padTop} ${classes.outline}`,
                        )}
                        {returnDateField(
                            row.rek_updated_date,
                            conf,
                            `${classes.datefield} ${classes.padTop} ${classes.outline}`,
                        )}
                    </Hidden>
                    {!!adminUser && (
                        <Grid item xs={2} sm={1}>
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
