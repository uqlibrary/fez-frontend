import React from 'react';
import Box from '@mui/material/Box';
import * as actions from 'actions';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { pathConfig } from 'config';
import { parseHtmlToJSX } from 'helpers/general';
import AdminActions from './AdminActions';
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import Button from '@mui/material/Button';
import { controlledVocabConfig } from 'config';
import Add from '@mui/icons-material/Add';
import { useQueryStringParams, useCommunityCollectionControls } from './hooks';
import { PublicationsListSorting } from 'modules/SharedComponents/PublicationsList';
import { PublicationsListPaging } from 'modules/SharedComponents/PublicationsList';
import param from 'can-param';
import Grid from '@mui/material/Grid';

const moment = require('moment');

const classes = {
    dateField: {
        paddingRight: '5px',
    },
    centerAlign: {
        textAlign: 'center',
    },
};

const returnDateField = (date, conf, classes) => {
    return (
        <Grid item xs={2} sx={{ ...classes, display: { xs: 'none', md: 'block' } }}>
            <Typography variant="body2">
                {moment(date)
                    .local()
                    .format(conf.dateFormat)}
            </Typography>
        </Grid>
    );
};
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

    const exportCollectionsLoading = useSelector(
        state => state.get('exportCollectionsReducer').exportCollectionsLoading,
    );
    const exportingCollectionsPid = useSelector(state => state.get('exportCollectionsReducer').exportingCollectionsPid);
    const isLoadingOrExporting = collectionListLoading || exportCollectionsLoading;

    const filteredData = collectionList.filter(obj => obj.parent === pid);
    const finalList = filteredData.length > 0 ? filteredData[0].data : { data: [] };

    const PagingData = {
        from: finalList.from,
        to: finalList.to,
        total: finalList.total,
        per_page: finalList.per_page,
        current_page: finalList.current_page,
    };

    const location = {
        search: `?${param({
            pid,
            page: PagingData.current_page,
            pageSize: PagingData.per_page,
            sortBy,
            sortDirection,
        })}`,
    };

    const { queryParams } = useQueryStringParams(location);
    const { handleCollectionExport } = useCommunityCollectionControls(queryParams, actions);

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
                <div>
                    <InlineLoader loaderId="collections-page-loading" message={conf.loading.message} />
                </div>
            )}
            {loadingCollectionsPid !== pid && (
                <Box
                    sx={{
                        backgroundColor: '#eee',
                        padding: '20px',
                        boxShadow: 'inset 0px 2px 4px 0px rgba(0,0,0,0.2)',
                    }}
                    data-testid={`collection-records-${pid}`}
                    id={`collection-records-${pid}`}
                >
                    {!!adminUser && (
                        <Button
                            component={Link}
                            to={`${pathConfig.admin.collection}?pid=${pid}&name=${title}`}
                            id={`admin-add-community-button-${pid}`}
                            data-testid={`admin-add-community-button-${pid}`}
                            startIcon={<Add />}
                            variant={'contained'}
                            color={'primary'}
                            sx={{ marginBottom: '10px' }}
                        >
                            {controlledVocabConfig.addNewVocabularyText}
                        </Button>
                    )}
                    {finalList.data.length > 0 && (
                        <Collapse in={open} timeout={200} unmountOnExit>
                            <Box sx={{ minHeight: 200, backgroundColor: '#FFF', padding: '10px' }}>
                                <Typography
                                    variant="caption"
                                    component={'div'}
                                    sx={{ fontWeight: 600, marginBottom: '10px' }}
                                    id={`total-collections-${pid}`}
                                    data-testid={`total-collections-${pid}`}
                                >
                                    {controlledVocabConfig.collectionCountTitle(
                                        PagingData.from,
                                        PagingData.to,
                                        PagingData.total,
                                        title,
                                    )}
                                </Typography>
                                <PublicationsListSorting
                                    data-testid="embedded-collections-sorting-top"
                                    exportData={conf.export}
                                    pagingData={PagingData}
                                    sortingData={conf.sorting}
                                    sortBy={sortBy}
                                    sortDirection={sortDirection}
                                    onSortByChanged={sortByChanged}
                                    onPageSizeChanged={pageSizeChanged}
                                    pageSize={PagingData.per_page}
                                    canUseExport
                                    onExportPublications={handleCollectionExport}
                                    disabled={isLoadingOrExporting}
                                />

                                <PublicationsListPaging
                                    loading={false}
                                    pagingData={PagingData}
                                    onPageChanged={pageChanged}
                                    disabled={isLoadingOrExporting}
                                    pagingId="embedded-collections-paging-top"
                                    data-testid="embedded-collections-paging-top"
                                />
                                {exportCollectionsLoading && exportingCollectionsPid === pid && (
                                    <div>
                                        <InlineLoader
                                            loaderId="collections-page-exporting"
                                            message={conf.loading.exportLoadingMessage}
                                        />
                                    </div>
                                )}
                                {exportingCollectionsPid !== pid && (
                                    <Grid container>
                                        <Grid container sx={{ minWidth: 0 }}>
                                            <Grid
                                                container
                                                data-testid="embedded-collections-primary-header"
                                                spacing={0}
                                                sx={{ fontWeight: 400, padding: '15px 0px' }}
                                            >
                                                <Grid item md={1} sx={{ display: { xs: 'none', md: 'block' } }}>
                                                    {labels.id}
                                                </Grid>
                                                <Grid item md={4}>
                                                    <Box sx={{ float: 'left', width: '24px' }} />
                                                    <Box sx={{ float: 'right', width: 'calc(100% - 30px)' }}>
                                                        {labels.title}
                                                    </Box>
                                                </Grid>
                                                <Grid item md={1} sx={{ display: { xs: 'none', md: 'block' } }}>
                                                    {labels.order}
                                                </Grid>
                                                <Grid item md={1} sx={{ display: { xs: 'none', md: 'block' } }}>
                                                    {labels.license}
                                                </Grid>
                                                <Grid item md={1} sx={{ display: { xs: 'none', md: 'block' } }}>
                                                    {labels.external_id}
                                                </Grid>
                                                <Grid item md={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                                                    {labels.path}
                                                </Grid>
                                                {!!adminUser && (
                                                    <Grid item md={2} xs={1} sx={{ textAlign: 'right' }}>
                                                        {labels.actions}
                                                    </Grid>
                                                )}
                                            </Grid>
                                            <Grid container data-testid="embedded-collections-primary-body">
                                                {finalList.data.map(row => (
                                                    <Grid
                                                        sx={{
                                                            boxSizing: 'border-box',
                                                            boxShadow: '0 -1px 0 #eaeaea',
                                                            padding: '15px 0px',
                                                        }}
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
                                                            sx={{ ...classes.dateField }}
                                                        >
                                                            <Typography variant="body2">
                                                                <Link
                                                                    to={pathConfig.records.view(row.rek_pid)}
                                                                    id={`collection-title-${row.rek_pid}`}
                                                                    data-testid={`collection-title-${row.rek_pid}`}
                                                                >
                                                                    {parseHtmlToJSX(row.rek_title)}
                                                                </Link>
                                                            </Typography>
                                                            {!!row.rek_description && (
                                                                <Typography variant="caption">
                                                                    {row.rek_description}
                                                                </Typography>
                                                            )}
                                                            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{ fontStyle: 'italic' }}
                                                                >
                                                                    {controlledVocabConfig.formatCreationDate(
                                                                        moment(row.rek_created_date)
                                                                            .local()
                                                                            .format(conf.dateFormat),
                                                                    )}
                                                                    <Box
                                                                        sx={{ display: { xs: 'inline', sm: 'none' } }}
                                                                        component="span"
                                                                    >
                                                                        <br />
                                                                    </Box>
                                                                    <Typography
                                                                        sx={{
                                                                            fontStyle: 'italic',
                                                                            display: { xs: 'none', sm: 'inline' },
                                                                        }}
                                                                        component="span"
                                                                        variant="caption"
                                                                    >
                                                                        {' / '}
                                                                    </Typography>
                                                                    {controlledVocabConfig.formatUpdatedDate(
                                                                        moment(row.rek_updated_date)
                                                                            .local()
                                                                            .format(conf.dateFormat),
                                                                    )}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={2}
                                                            md={1}
                                                            sx={{
                                                                ...classes.centerAlign,
                                                                display: { xs: 'none', sm: 'block' },
                                                            }}
                                                        >
                                                            <Link to={`/records/search?${encodeLink(row.rek_pid)}`}>
                                                                {controlledVocabConfig.viewCommunityText}
                                                            </Link>
                                                        </Grid>
                                                        {returnDateField(row.rek_created_date, conf, classes.dateField)}
                                                        {returnDateField(row.rek_updated_date, conf, classes.dateField)}

                                                        <Grid
                                                            item
                                                            xs={2}
                                                            sx={{
                                                                ...classes.centerAlign,
                                                                display: { xs: 'block', sm: 'none' },
                                                            }}
                                                        >
                                                            <div>
                                                                <Link to={`/records/search?${encodeLink(row.rek_pid)}`}>
                                                                    {controlledVocabConfig.viewCommunityText}
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
                                                        {!!adminUser && (
                                                            <Grid
                                                                item
                                                                xs={2}
                                                                md={1}
                                                                sx={{
                                                                    ...classes.dateField,
                                                                    ...classes.centerAlign,
                                                                    display: { xs: 'none', sm: 'block' },
                                                                }}
                                                            >
                                                                <AdminActions
                                                                    record={row.rek_pid}
                                                                    id={`row-admin-actions-${row.rek_pid}`}
                                                                    data-testid={`row-admin-actions-${row.rek_pid}`}
                                                                />
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )}
                                <PublicationsListPaging
                                    loading={false}
                                    pagingData={PagingData}
                                    onPageChanged={pageChanged}
                                    disabled={isLoadingOrExporting}
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
                </Box>
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
