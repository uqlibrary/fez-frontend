import React from 'react';
import Box from '@material-ui/core/Box';
import * as actions from 'actions';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { pathConfig } from 'config';
import ReactHtmlParser from 'react-html-parser';
import AdminActions from './AdminActions';
import PropTypes from 'prop-types';
import Collapse from '@material-ui/core/Collapse';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import CommunityCollectionsSorting from './CommunityCollectionsSorting';
import Button from '@material-ui/core/Button';
import { communityCollectionsConfig } from 'config';
import Add from '@material-ui/icons/Add';
import { PublicationsListPaging } from 'modules/SharedComponents/PublicationsList';
import { Grid } from '@material-ui/core';
import { Hidden } from '@material-ui/core';

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

const useStyles = makeStyles(theme => ({
    adminButton: {
        marginBottom: 10,
        backgroundColor: '#51247A',
        color: 'white',
        '&:hover': {
            backgroundColor: '#51247A',
            color: 'white',
        },
    },
    primaryHeader: {
        fontWeight: 400,
        padding: '15px 0px',
    },
    collectionBase: {
        backgroundColor: '#eee',
        padding: 20,
        boxShadow: 'inset 0px 2px 4px 0px rgba(0,0,0,0.2)',
        [theme.breakpoints.down('md')]: {},
    },
    collectionContainer: {
        minHeight: 200,
        backgroundColor: 'white',
        padding: 10,
    },
    collectionCountTitle: {
        fontWeight: 600,
        marginBottom: 10,
        display: 'block',
    },
    dateField: {
        paddingRight: 5,
    },
    centerAlign: {
        textAlign: 'center',
    },
    collectionRow: {
        boxSizing: 'border-box',
        outline: '1px solid #ededed',
        boxShadow: '0 -1px 0 #eaeaea',
        padding: '15px 0px',
    },
    responsiveMin: {
        minWidth: 0,
    },
    autoOverflow: {
        overflow: 'auto',
    },
    italic: {
        fontStyle: 'italic',
    },
}));
export const CollectionsListEmbedded = ({ title, pid, labels, conf, adminUser, open }) => {
    const dispatch = useDispatch();
    const [sortDirection, setSortDirection] = React.useState('Asc');
    const [sortBy, setSortBy] = React.useState('title');
    React.useEffect(() => {
        /* istanbul ignore else */
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
    const collectionListLoading = useSelector(state => state.get('viewCollectionsReducer').loadingCollections);
    const loadingCollectionsPid = useSelector(state => state.get('viewCollectionsReducer').loadingCollectionsPid);
    const classes = useStyles();

    const filteredData = collectionList.filter(obj => obj.parent === pid);
    const finalList = filteredData.length > 0 ? filteredData[0].data : { data: [] };

    const PagingData = {
        from: finalList.from,
        to: finalList.to,
        total: finalList.total,
        per_page: finalList.per_page,
        current_page: finalList.current_page,
    };

    const sortByChanged = (sortby, direction) => {
        setSortDirection(direction);
        setSortBy(sortby);
        dispatch(
            actions.loadCCCollectionsList({
                pid: pid,
                pageSize: PagingData.per_page,
                page: PagingData.current_page,
                direction: direction,
                sortBy: sortby,
            }),
        );
    };

    const pageSizeChanged = pageSize => {
        dispatch(
            actions.loadCCCollectionsList({
                pid: pid,
                pageSize: pageSize,
                page: 1,
                direction: 'Asc',
                sortBy: 'title',
            }),
        );
    };
    const pageChanged = page => {
        dispatch(
            actions.loadCCCollectionsList({
                pid: pid,
                pageSize: PagingData.per_page,
                page: page,
                direction: 'Asc',
                sortBy: 'title',
            }),
        );
    };

    const encodeLink = pid => {
        return `searchQueryParams${encodeURIComponent('[rek_ismemberof][value][]')}=${encodeURIComponent(
            pid,
        )}&searchMode=advanced&commColl=true`;
    };

    return (
        <div>
            {collectionListLoading && loadingCollectionsPid === pid && (
                <div data-testid="collections-page-loading">
                    <InlineLoader loaderId="collections-page-loading" message={conf.loading.message} />
                </div>
            )}
            {loadingCollectionsPid !== pid && (
                <div
                    className={classes.collectionBase}
                    data-testid={`collection-records-${pid}`}
                    id={`collection-records-${pid}`}
                >
                    {!!adminUser && (
                        <Button
                            className={classes.adminButton}
                            component={Link}
                            variant="outlined"
                            to={`${pathConfig.admin.collection}?pid=${pid}&name=${title}`}
                            data-test-id="admin-add-community-button"
                            startIcon={<Add />}
                        >
                            {communityCollectionsConfig.addNewCollectionText}
                        </Button>
                    )}
                    {finalList.data.length > 0 && (
                        <Collapse in={open} timeout={200} unmountOnExit>
                            <Box className={classes.collectionContainer}>
                                <Typography
                                    variant="caption"
                                    className={classes.collectionCountTitle}
                                    id={`total-collections-${pid}`}
                                    data-testid={`total-collections-${pid}`}
                                >
                                    {communityCollectionsConfig.collectionCountTitle(
                                        PagingData.from,
                                        PagingData.to,
                                        PagingData.total,
                                        title,
                                    )}
                                </Typography>
                                <CommunityCollectionsSorting
                                    data-testid="embedded-collections-sorting-top"
                                    exportData={conf.export}
                                    pagingData={PagingData}
                                    sortingData={conf.sorting}
                                    sortBy={sortBy}
                                    sortDirection={sortDirection}
                                    onSortByChanged={sortByChanged}
                                    onPageSizeChanged={pageSizeChanged}
                                    pageSize={PagingData.per_page}
                                    isCollection
                                />

                                <PublicationsListPaging
                                    loading={false}
                                    pagingData={PagingData}
                                    onPageChanged={pageChanged}
                                    disabled={false}
                                    pagingId="embedded-collections-paging-top"
                                    data-testid="embedded-collections-paging-top"
                                />
                                <Grid container className={classes.autoOverflow}>
                                    <Grid container className={classes.responsiveMin}>
                                        <Grid
                                            container
                                            data-testid="embedded-collections-primary-header"
                                            spacing={0}
                                            className={classes.primaryHeader}
                                        >
                                            <Grid
                                                item
                                                xs={10}
                                                sm={adminUser ? 8 : 9}
                                                md={adminUser ? 6 : 7}
                                                className={classes.dateField}
                                            >
                                                {labels.title}
                                            </Grid>
                                            <Hidden smDown>
                                                <Grid item xs={2} className={classes.dateField}>
                                                    {labels.creation_date}
                                                </Grid>
                                                <Grid item xs={2} className={classes.dateField}>
                                                    {labels.updated_date}
                                                </Grid>
                                            </Hidden>
                                            <Hidden xsDown>
                                                <Grid item sm={2} md={1} className={classes.centerAlign}>
                                                    {communityCollectionsConfig.viewCommunityTitle}
                                                </Grid>
                                                {!!adminUser && (
                                                    <Grid
                                                        item
                                                        xs={2}
                                                        md={1}
                                                        className={`${classes.dateField} ${classes.centerAlign}`}
                                                    >
                                                        {labels.actions}
                                                    </Grid>
                                                )}
                                            </Hidden>
                                            <Hidden smUp>
                                                <Grid item xs={2} className={classes.centerAlign}>
                                                    View
                                                </Grid>
                                            </Hidden>
                                        </Grid>
                                        <Grid container data-testid="embedded-collections-primary-body">
                                            {finalList.data.map(row => (
                                                <Grid
                                                    className={classes.collectionRow}
                                                    container
                                                    key={row.rek_pid}
                                                    id={`row-${row.rek_pid}`}
                                                    data-testid={`row-${row.rek_pid}`}
                                                >
                                                    <Grid
                                                        item
                                                        xs={10}
                                                        sm={adminUser ? 8 : 9}
                                                        md={adminUser ? 6 : 7}
                                                        className={classes.dateField}
                                                    >
                                                        <Typography variant="body2">
                                                            <Link
                                                                to={pathConfig.records.view(row.rek_pid)}
                                                                id={`collection-title-${row.rek_pid}`}
                                                                data-testid={`collection-title-${row.rek_pid}`}
                                                            >
                                                                {ReactHtmlParser(row.rek_title)}
                                                            </Link>
                                                        </Typography>
                                                        {!!row.rek_description && (
                                                            <Typography variant="caption">
                                                                {row.rek_description}
                                                            </Typography>
                                                        )}
                                                        <Hidden mdUp>
                                                            <div>
                                                                <Typography
                                                                    variant="caption"
                                                                    className={classes.italic}
                                                                >
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
                                                    </Grid>
                                                    <Hidden smDown>
                                                        {returnDateField(row.rek_created_date, conf, classes.dateField)}
                                                        {returnDateField(row.rek_updated_date, conf, classes.dateField)}
                                                    </Hidden>

                                                    <Hidden smUp>
                                                        <Grid item xs={2} className={classes.centerAlign}>
                                                            <div>
                                                                <Link to={`/records/search?${encodeLink(row.rek_pid)}`}>
                                                                    {communityCollectionsConfig.viewCommunityText}
                                                                </Link>
                                                            </div>
                                                            {!!adminUser && (
                                                                <AdminActions
                                                                    record={row.rek_pid}
                                                                    id={`row-admin-actions-${row.rek_pid}`}
                                                                    data-testid={`row-admin-actions-${row.rek_pid}`}
                                                                />
                                                            )}
                                                        </Grid>
                                                    </Hidden>
                                                    <Hidden xsDown>
                                                        <Grid item xs={2} md={1} className={classes.centerAlign}>
                                                            <Link to={`/records/search?${encodeLink(row.rek_pid)}`}>
                                                                {communityCollectionsConfig.viewCommunityText}
                                                            </Link>
                                                        </Grid>
                                                        {!!adminUser && (
                                                            <Grid
                                                                item
                                                                xs={2}
                                                                md={1}
                                                                className={`${classes.dateField} ${classes.centerAlign}`}
                                                            >
                                                                <AdminActions
                                                                    record={row.rek_pid}
                                                                    id={`row-admin-actions-${row.rek_pid}`}
                                                                    data-testid={`row-admin-actions-${row.rek_pid}`}
                                                                />
                                                            </Grid>
                                                        )}
                                                    </Hidden>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <PublicationsListPaging
                                    loading={false}
                                    pagingData={PagingData}
                                    onPageChanged={pageChanged}
                                    disabled={false}
                                    pagingId="embedded-collections-paging-bottom"
                                    data-testid="embedded-collections-paging-bottom"
                                />
                            </Box>
                        </Collapse>
                    )}
                    {!finalList.data.length > 0 && (
                        <div>
                            <Typography variant="caption">{conf.loading.noCollections}</Typography>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
CollectionsListEmbedded.propTypes = {
    title: PropTypes.string,
    records: PropTypes.array,
    labels: PropTypes.object,
    conf: PropTypes.object,
    adminUser: PropTypes.bool,
    pid: PropTypes.string,
    open: PropTypes.bool,
};
export default CollectionsListEmbedded;
