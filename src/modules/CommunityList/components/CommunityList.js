import React from 'react';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import MUIDataTable from 'mui-datatables';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@material-ui/core/Grid';
import { useIsUserSuperAdmin } from 'hooks';
import Typography from '@material-ui/core/Typography';
import AdminActions from './AdminActions';
import * as actions from 'actions';
import locale from 'locale/components';
import { useDispatch, useSelector } from 'react-redux';

import CommunityCollectionsSorting from './CommunityCollectionsSorting';

const moment = require('moment');

const options = {
    filterType: 'checkbox',
    serverSide: false,
    viewColumns: false,
};
export const CommunityList = () => {
    const isSuperAdmin = useIsUserSuperAdmin();
    const columns = [
        {
            name: 'rek_pid',
            label: 'ID',
            options: {
                filter: false,
                sort: false,
                display: 'excluded',
            },
        },
        {
            name: 'rek_title',
            label: 'Title',
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value, tableMeta) => {
                    return !!tableMeta.rowData[2] ? (
                        <div>
                            <Typography variant="body2">
                                <a href={`#/view/${tableMeta.rowData[0]}`}>{value}</a>
                            </Typography>
                            <Typography variant="caption">{tableMeta.rowData[2]}</Typography>
                        </div>
                    ) : (
                        <Typography variant="body2">
                            <a href={`#/view/${tableMeta.rowData[0]}`}>{value}</a>
                        </Typography>
                    );
                },
            },
        },

        {
            name: 'rek_description',
            label: 'Description',
            options: {
                display: 'excluded',
                filter: false,
            },
        },

        {
            name: 'rek_created_date',
            label: 'Created Date',
            options: {
                filter: false,
                sort: true,
                customBodyRender: value => {
                    return moment(value)
                        .local()
                        .format('ddd MMM DD YYYY, hh:mm:ss A');
                },
            },
        },
        {
            name: 'rek_updated_date',
            label: 'Updated Date',
            options: {
                filter: false,
                sort: true,
                customBodyRender: value => {
                    return moment(value)
                        .local()
                        .format('ddd MMM DD YYYY, hh:mm:ss A');
                },
            },
        },
        {
            name: 'actions',
            label: 'Actions',
            options: {
                filter: false,
                sort: false,
                display: isSuperAdmin,
                customBodyRender: (value, rowArrayData) => {
                    return isSuperAdmin ? <AdminActions record={rowArrayData.rowData[0]} /> : '';
                },
            },
        },
        {
            name: 'citationCount',
            label: 'Citation Count',
            options: {
                display: 'excluded',
                filter: false,
                sort: false,
            },
        },
    ];
    const dispatch = useDispatch();
    const communityList = useSelector(state => state.get('viewCommunitiesReducer').communityList);
    React.useEffect(() => {
        dispatch(actions.loadCommunitiesList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 15FEB New Approach
    const txt = locale.components.communitiesCollections;

    const conf = {
        title: 'List of Communities',
        headings: 'none',
    };
    const tempPagingData = {
        from: 1,
        to: 20,
        total: 100,
        per_page: 20,
        current_page: 1,
    };
    const sortingDefaults = txt.sortingDefaults ?? {};
    console.log('PROPERTIES', sortingDefaults);

    // const { sortBy, sortDirection, pageSize } = journalsListLoading
    //     ? { ...sortingDefaults }
    //     : getSearchResultSortingParams(
    //           journalSearchQueryParams,
    //           // eslint-disable-next-line camelcase
    //           journalsList?.per_page,
    //           sortingDefaults,
    //       );
    const { sortBy, sortDirection, pageSize } = { ...sortingDefaults };
    return (
        <StandardPage title={conf.title}>
            <Grid item xs={12}>
                <CommunityCollectionsSorting
                    canUseExport
                    exportData={txt.export}
                    pagingData={tempPagingData}
                    sortingData={locale.components.communitiesCollections.sorting}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    // onExportPublications={handleExport}
                    // onSortByChanged={sortByChanged}
                    // onPageSizeChanged={pageSizeChanged}
                    pageSize={pageSize}
                    sortingDefaults={sortingDefaults}
                />
            </Grid>
            <MUIDataTable
                title={conf.title}
                data={communityList}
                columns={columns}
                options={options}
                rowsPerPageOptions={[10, 20, 50, 100]}
            />
        </StandardPage>
    );
};

export default React.memo(CommunityList);
