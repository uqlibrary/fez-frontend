import React from 'react';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { useParams } from 'react-router';

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

export const CommunityList = () => {
    const { pid } = useParams();

    const [sortDirection, setSortDirection] = React.useState('Asc');
    const [sortBy, setSortBy] = React.useState('title');

    const isSuperAdmin = useIsUserSuperAdmin();

    const dispatch = useDispatch();

    const communityList = useSelector(state => state.get('viewCollectionsReducer').collectionList);
    const totalRecords = useSelector(state => state.get('viewCollectionsReducer').totalRecords);
    const startRecord = useSelector(state => state.get('viewCollectionsReducer').startRecord);
    const endRecord = useSelector(state => state.get('viewCollectionsReducer').endRecord);
    const currentPage = useSelector(state => state.get('viewCollectionsReducer').currentPage);
    const perPage = useSelector(state => state.get('viewCollectionsReducer').perPage);

    // const pidX = 'UQ:12096';

    // const ParentList = '';

    const pageSizeChanged = pageSize => {
        dispatch(
            actions.loadCCCollectionsList({
                pid: pid,
                pageSize: pageSize,
                page: 1,
                direction: sortDirection,
                sortBy: sortBy,
            }),
        );
    };
    const pageChanged = page => {
        console.log(page);
        dispatch(
            actions.loadCCCollectionsList({
                pid: pid,
                pageSize: perPage,
                page: page,
                direction: sortDirection,
                sortBy: sortBy,
            }),
        );
    };

    const sortByChanged = (sortby, direction) => {
        setSortDirection(direction);
        setSortBy(sortby);
        dispatch(
            actions.loadCCCollectionsList({
                pid: pid,
                pageSize: perPage,
                page: currentPage,
                direction: direction,
                sortBy: sortby,
            }),
        );
    };

    React.useEffect(() => {
        dispatch(actions.loadCCCollectionsList({ pid: pid, pageSize: 10, page: 1, direction: 'asc', sortBy: 'Title' }));
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
    if (!!sortedList) {
        switch (sortBy) {
            case 'title':
                sortedList.sort((a, b) => (a.rek_title < b.rek_title ? 1 : -1));
                sortDirection === 'Asc' && sortedList.reverse();
                break;
            case 'created_date':
                sortedList.sort((a, b) => (a.rek_created_date < b.rek_created_date ? 1 : -1));
                sortDirection === 'Asc' && sortedList.reverse();
                break;
            case 'updated_date':
                sortedList.sort((a, b) => (a.rek_updated_date < b.rek_updated_date ? 1 : -1));
                sortDirection === 'Asc' && sortedList.reverse();
                break;
            default:
                break;
        }
    }
    return (
        <StandardPage title={txt.title.collections}>
            {!!isSuperAdmin && (
                <Grid item xs={12} sm={3} style={{ marginBottom: 10 }} data-test-id="admin-add-community">
                    <Button
                        component={Link}
                        variant="outlined"
                        to={pathConfig.admin.collection}
                        data-test-id="admin-add-community-button"
                    >
                        {communityCollectionsConfig.addNewCollectionText}
                    </Button>
                </Grid>
            )}
            {/* {
                (ParentList =
                    sortedList[0].rek_display_type === 9
                        ? (ParentList = ` ${sortedList[0].fez_record_search_key_ismemberof[0].rek_ismemberof_lookup}`)
                        : '')
            }
            {ParentList.length > 0 && <p>List of collections in {ParentList}</p>} */}
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
