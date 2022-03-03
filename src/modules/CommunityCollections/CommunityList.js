import React from 'react';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { useIsUserSuperAdmin } from 'hooks';
import { Link } from 'react-router-dom';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

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

export const CommunityList = () => {
    const history = useHistory();
    let sortDirection = 'Asc';
    let sortBy = 'title';

    const isSuperAdmin = useIsUserSuperAdmin();

    const dispatch = useDispatch();

    const queryStringObject = queryString.parse(
        location && ((location.hash && location.hash.replace('?', '&').replace('#', '?')) || location.search),
        { ignoreQueryPrefix: true },
    );

    sortDirection = queryStringObject.sortDirection ? queryStringObject.sortDirection : sortDirection;
    sortDirection = sortDirection.charAt(0).toUpperCase() + sortDirection.slice(1);
    sortBy = queryStringObject.sortBy ? queryStringObject.sortBy : sortBy;

    const communityList = useSelector(state => state.get('viewCommunitiesReducer').communityList);
    const totalRecords = useSelector(state => state.get('viewCommunitiesReducer').totalRecords);
    const startRecord = useSelector(state => state.get('viewCommunitiesReducer').startRecord);
    const endRecord = useSelector(state => state.get('viewCommunitiesReducer').endRecord);
    const currentPage = queryStringObject.page ? parseInt(queryStringObject.page, 10) : 1;
    const perPage = queryStringObject.pageSize ? parseInt(queryStringObject.pageSize, 10) : 10;

    const pushHistory = (pageSize, currentPage, sortBy, sortDirection) => {
        history.push({
            pathname: '/communities',
            search: `?pageSize=${pageSize}&page=${currentPage}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
        });
    };

    const pageSizeChanged = pageSize => {
        dispatch(
            actions.loadCommunitiesList({
                pageSize: pageSize,
                page: 1,
                direction: sortDirection,
                sortBy: sortBy,
            }),
        );
        pushHistory(pageSize, 1, sortBy, sortDirection);
    };
    const pageChanged = page => {
        pushHistory(perPage, page, sortBy, sortDirection);
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
        pushHistory(perPage, currentPage, sortby, direction);
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
        pushHistory(perPage, currentPage, sortBy, sortDirection);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const txt = locale.components.communitiesCollections;

    const labels = txt.columns.labels;

    const tempPagingData = {
        from: startRecord,
        to: endRecord,
        total: totalRecords,
        per_page: perPage,
        current_page: currentPage,
    };
    const sortingDefaults = txt.sortingDefaults ?? {};
    const sortedList = [...communityList];

    return (
        <StandardPage title={txt.title.communities}>
            {!!isSuperAdmin && (
                <Grid item xs={12} sm={3} style={{ marginBottom: 10 }} data-test-id="admin-add-community">
                    <Button
                        component={Link}
                        variant="outlined"
                        to={pathConfig.admin.community}
                        data-test-id="admin-add-community-button"
                    >
                        {communityCollectionsConfig.addNewCommunityText}
                    </Button>
                </Grid>
            )}
            <StandardCard noHeader>
                <Grid item xs={12} style={{ marginBottom: 10 }}>
                    <CommunityCollectionsSorting
                        data-testid="community-collections-sorting-top"
                        // canUseExport
                        exportData={txt.export}
                        pagingData={tempPagingData}
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
                        pagingData={tempPagingData}
                        onPageChanged={pageChanged}
                        disabled={false}
                        pagingId="community-collections-paging-top"
                        data-testid="community-collections-paging-top"
                    />
                </Grid>
                {sortedList.length > 0 ? (
                    <CommunityTable records={sortedList} labels={labels} conf={txt} />
                ) : (
                    <InlineLoader loaderId="communities-page-loading" message={txt.loading.message} />
                )}
                <Grid item xs={12} style={{ marginTop: 10 }}>
                    <CommunityCollectionsPaging
                        data-testid="community-collections-paging-bottom"
                        loading={false}
                        pagingData={tempPagingData}
                        onPageChanged={pageChanged}
                        disabled={false}
                        pagingId="community-collections-paging-bottom"
                    />
                </Grid>
            </StandardCard>
        </StandardPage>
    );
};

export default React.memo(CommunityList);
