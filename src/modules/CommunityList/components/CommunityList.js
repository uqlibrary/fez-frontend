import React from 'react';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AdminActions from './AdminActions';
import { useIsUserSuperAdmin } from 'hooks';
const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    dateCell: {
        minWidth: 120,
    },
});

import * as actions from 'actions';
import locale from 'locale/components';
import { useDispatch, useSelector } from 'react-redux';

import CommunityCollectionsSorting from './CommunityCollectionsSorting';

const moment = require('moment');

export const getSearchResultSortingParams = (searchQueryParams, listPerPage, sortingDefaults) => {
    const { sortBy = 'title', sortDirection = 'Asc' } = {
        ...sortingDefaults,
        ...searchQueryParams,
    };
    const pageSize = searchQueryParams?.pageSize
        ? Number(searchQueryParams.pageSize)
        : listPerPage ?? sortingDefaults?.pageSize ?? 20;
    return { sortBy, sortDirection, pageSize };
};

export const CommunityList = () => {
    const isSuperAdmin = useIsUserSuperAdmin();
    const classes = useStyles();
    const dispatch = useDispatch();

    const communityList = useSelector(state => state.get('viewCommunitiesReducer').communityList);
    const totalRecords = useSelector(state => state.get('viewCommunitiesReducer').totalRecords);
    const startRecord = useSelector(state => state.get('viewCommunitiesReducer').startRecord);
    const endRecord = useSelector(state => state.get('viewCommunitiesReducer').endRecord);
    const currentPage = useSelector(state => state.get('viewCommunitiesReducer').currentPage);
    const perPage = useSelector(state => state.get('viewCommunitiesReducer').perPage);

    const pageSizeChanged = pageSize => {
        dispatch(actions.loadCommunitiesList({ pageSize: pageSize }));
    };
    const sortByChanged = list => {
        console.log('SORTING CHANGED', list);
        // dispatch(actions.sortCommunitiesList({ direction: direction, sortBy: sortby, list }));
    };

    React.useEffect(() => {
        dispatch(actions.loadCommunitiesList({ pageSize: 10, direction: 'asc', sortBy: 'Title' }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 15FEB New Approach
    const txt = locale.components.communitiesCollections;

    const conf = {
        title: 'Communities',
        headings: 'none',
    };
    const tempPagingData = {
        from: startRecord,
        to: endRecord,
        total: totalRecords,
        per_page: perPage,
        current_page: currentPage,
    };
    const sortingDefaults = txt.sortingDefaults ?? {};

    return (
        <StandardPage title={conf.title}>
            <StandardCard noHeader>
                <Grid item xs={12}>
                    <CommunityCollectionsSorting
                        // canUseExport
                        exportData={txt.export}
                        pagingData={tempPagingData}
                        sortingData={locale.components.communitiesCollections.sorting}
                        sortBy={'title'}
                        sortDirection={'Asc'}
                        // onExportPublications={handleExport}
                        onSortByChanged={sortByChanged}
                        onPageSizeChanged={pageSizeChanged}
                        pageSize={perPage}
                        sortingDefaults={sortingDefaults}
                    />
                </Grid>

                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell className={classes.dateCell} align="right">
                                    Date Created
                                </TableCell>
                                <TableCell className={classes.dateCell} align="right">
                                    Date Modified
                                </TableCell>
                                {!!isSuperAdmin && <TableCell align="right">Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {communityList.length > 0 ? (
                                communityList.map(row => (
                                    <TableRow key={row.rek_pid}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2">
                                                <a href={`#/view/${row.rek_pid}`}>{row.rek_title}</a>
                                            </Typography>
                                            {!!row.rek_description && (
                                                <Typography variant="caption">{row.rek_description}</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="right" className={classes.dateCell}>
                                            {moment(row.rek_created_date)
                                                .local()
                                                .format('ddd MMM DD, YYYY')}
                                        </TableCell>
                                        <TableCell align="right" className={classes.dateCell}>
                                            {moment(row.rek_updated_date)
                                                .local()
                                                .format('ddd MMM DD, YYYY')}
                                        </TableCell>
                                        {!!isSuperAdmin && (
                                            <TableCell align="right">
                                                <AdminActions record={row.rek_pid} />
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow key={0}>
                                    <TableCell component="th" scope="row">
                                        ...Data Loading...
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </StandardCard>
        </StandardPage>
    );
};

export default React.memo(CommunityList);
