import React from 'react';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { userIsAdmin } from 'hooks';
import { Link } from 'react-router-dom';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import Typography from '@material-ui/core/Typography';
import { pathConfig } from 'config';
import { communityCollectionsConfig } from 'config';

import * as actions from 'actions';
import locale from 'locale/components';
import { useDispatch, useSelector } from 'react-redux';

import CommunityCollectionsSorting from './components/CommunityCollectionsSorting';
import { CommunityCollectionsPaging } from './components/CommunityCollectionsPaging';
import { CommunityTable } from './components/CommunityTable';

import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import Add from '@material-ui/icons/Add';

import { pushHistory } from './components/functions';

export const CommunityList = () => {
    const [autoCollapse, setAutoCollapse] = React.useState(false);
    const handleSwitchChange = event => {
        setAutoCollapse(event.target.checked);
    };

    const history = useHistory();
    let sortDirection = 'Asc';
    let sortBy = 'title';

    const adminUser = userIsAdmin();

    const dispatch = useDispatch();

    const queryStringObject = queryString.parse(
        location && ((location.hash && location.hash.replace('?', '&').replace('#', '?')) || location.search),
        { ignoreQueryPrefix: true },
    );

    sortDirection = queryStringObject.sortDirection ? queryStringObject.sortDirection : sortDirection;
    sortDirection = sortDirection.charAt(0).toUpperCase() + sortDirection.slice(1);
    sortBy = queryStringObject.sortBy ? queryStringObject.sortBy : sortBy;

    const communityList = useSelector(state => state.get('viewCommunitiesReducer').communityList);
    const loadingCommunities = useSelector(state => state.get('viewCommunitiesReducer').loadingCommunities);
    const totalRecords = useSelector(state => state.get('viewCommunitiesReducer').totalRecords);
    const startRecord = useSelector(state => state.get('viewCommunitiesReducer').startRecord);
    const endRecord = useSelector(state => state.get('viewCommunitiesReducer').endRecord);
    const loadingCommunitiesError = useSelector(state => state.get('viewCommunitiesReducer').loadingCommunitiesError);

    const currentPage = queryStringObject.page ? parseInt(queryStringObject.page, 10) : 1;
    const perPage = queryStringObject.pageSize ? parseInt(queryStringObject.pageSize, 10) : 10;

    const pageSizeChanged = pageSize => {
        dispatch(
            actions.loadCommunitiesList({
                pageSize: pageSize,
                page: 1,
                direction: sortDirection,
                sortBy: sortBy,
            }),
        );
        pushHistory(history, pageSize, 1, sortBy, sortDirection);
    };
    const pageChanged = page => {
        pushHistory(history, perPage, page, sortBy, sortDirection);
        dispatch(
            actions.loadCommunitiesList({ pageSize: perPage, page: page, direction: sortDirection, sortBy: sortBy }),
        );
    };
    const sortByChanged = (sortby, direction) => {
        sortDirection = direction;
        sortBy = sortby;
        dispatch(
            actions.loadCommunitiesList({ pageSize: perPage, page: currentPage, direction: direction, sortBy: sortby }),
        );
        pushHistory(history, perPage, currentPage, sortby, direction);
    };

    React.useEffect(() => {
        dispatch(
            actions.loadCommunitiesList({
                pageSize: perPage,
                page: currentPage,
                direction: sortDirection,
                sortBy: sortBy,
            }),
        );
        pushHistory(history, perPage, currentPage, sortBy, sortDirection);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const txt = locale.components.communitiesCollections;

    const labels = txt.columns.labels;

    const PagindData = {
        from: startRecord,
        to: endRecord,
        total: totalRecords,
        per_page: perPage,
        current_page: currentPage,
    };
    const sortingDefaults = txt.sortingDefaults;
    const sortedList = [...communityList];

    return (
        <StandardPage title={txt.title.communities}>
            {!!!loadingCommunitiesError && (
                <React.Fragment>
                    <Grid container>
                        <>
                            <Grid item xs={6} style={{ marginBottom: 10 }} data-testid="admin-add-community">
                                {!!adminUser && (
                                    <Button
                                        component={Link}
                                        variant="outlined"
                                        to={pathConfig.admin.community}
                                        data-testid="admin-add-community-button"
                                        startIcon={<Add />}
                                        style={{
                                            backgroundColor: '#51247A',
                                            color: 'white',
                                        }}
                                    >
                                        {communityCollectionsConfig.addNewCommunityText}
                                    </Button>
                                )}
                            </Grid>
                            <Grid
                                item
                                xs={6}
                                style={{ textAlign: 'right', marginBottom: 10 }}
                                id="autoclose-community"
                                data-testid="autoclose-community"
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={autoCollapse}
                                            onChange={handleSwitchChange}
                                            name="collection-auto-collapse"
                                            id="collection-auto-collapse"
                                            data-testid="collection-auto-collapse"
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    }
                                    label={communityCollectionsConfig.collapseSwitchText}
                                />
                            </Grid>
                        </>
                    </Grid>

                    <StandardCard noHeader style={{ marginTop: 10 }}>
                        {!!!loadingCommunities && (
                            <Typography variant="body2" style={{ fontWeight: 600 }}>
                                Displaying communities {startRecord} to {endRecord} of {totalRecords} total communities
                            </Typography>
                        )}

                        <Grid item xs={12} style={{ marginBottom: 10 }}>
                            <CommunityCollectionsSorting
                                data-testid="community-collections-sorting-top"
                                // canUseExport
                                exportData={txt.export}
                                pagingData={PagindData}
                                sortingData={txt.sorting}
                                sortBy={sortBy}
                                sortDirection={sortDirection}
                                // onExportPublications={handleExport}
                                onSortByChanged={sortByChanged}
                                onPageSizeChanged={pageSizeChanged}
                                pageSize={perPage}
                                sortingDefaults={sortingDefaults}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CommunityCollectionsPaging
                                loading={false}
                                pagingData={PagindData}
                                onPageChanged={pageChanged}
                                disabled={false}
                                pagingId="community-collections-paging-top"
                                data-testid="community-collections-paging-top"
                            />
                        </Grid>
                        {sortedList.length > 0 ? (
                            <CommunityTable
                                records={sortedList}
                                labels={labels}
                                conf={txt}
                                autoCollapse={autoCollapse}
                                adminUser={adminUser}
                            />
                        ) : (
                            <InlineLoader loaderId="communities-page-loading" message={txt.loading.message} />
                        )}
                        <Grid item xs={12} style={{ marginTop: 10 }}>
                            <CommunityCollectionsPaging
                                data-testid="community-collections-paging-bottom"
                                loading={false}
                                pagingData={PagindData}
                                onPageChanged={pageChanged}
                                disabled={false}
                                pagingId="community-collections-paging-bottom"
                            />
                        </Grid>
                    </StandardCard>
                </React.Fragment>
            )}
            {!!loadingCommunitiesError && (
                <Grid item xs={12} style={{ marginTop: 10 }}>
                    <Alert
                        title="An error has occurred"
                        message={loadingCommunitiesError.message}
                        type="info_outline"
                    />
                </Grid>
            )}
        </StandardPage>
    );
};

export default React.memo(CommunityList);
