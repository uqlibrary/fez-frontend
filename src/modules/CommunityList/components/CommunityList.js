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
import { CommunityCollectionsPaging } from './CommunityCollectionsPaging';

const moment = require('moment');

export const CommunityList = () => {
    const [sortDirection, setSortDirection] = React.useState('Asc');
    const [sortBy, setSortBy] = React.useState('title');

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
        dispatch(
            actions.loadCommunitiesList({
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
            actions.loadCommunitiesList({ pageSize: perPage, page: page, direction: sortDirection, sortBy: sortBy }),
        );
    };

    const sortByChanged = (sortby, direction) => {
        setSortDirection(direction);
        setSortBy(sortby);
        dispatch(
            actions.loadCommunitiesList({ pageSize: perPage, page: currentPage, direction: direction, sortBy: sortby }),
        );
    };

    React.useEffect(() => {
        dispatch(actions.loadCommunitiesList({ pageSize: 10, page: 1, direction: 'asc', sortBy: 'Title' }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 15FEB New Approach
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

    return (
        <StandardPage title={txt.title.communities}>
            <StandardCard noHeader>
                <Grid item xs={12}>
                    <CommunityCollectionsSorting
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
                        pagingId="my-records-paging-top"
                    />
                </Grid>

                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{labels.title}</TableCell>
                                <TableCell className={classes.dateCell} align="right">
                                    {labels.creation_date}
                                </TableCell>
                                <TableCell className={classes.dateCell} align="right">
                                    {labels.updated_date}
                                </TableCell>
                                {!!isSuperAdmin && <TableCell align="right">{labels.actions}</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedList.length > 0 ? (
                                sortedList.map(row => (
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
                                                .format(txt.dateFormat)}
                                        </TableCell>
                                        <TableCell align="right" className={classes.dateCell}>
                                            {moment(row.rek_updated_date)
                                                .local()
                                                .format(txt.dateFormat)}
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
                                        {txt.loading.message}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid item xs={12}>
                    <CommunityCollectionsPaging
                        loading={false}
                        pagingData={tempPagingData}
                        onPageChanged={pageChanged}
                        disabled={false}
                        pagingId="my-records-paging-bottom"
                    />
                </Grid>
            </StandardCard>
        </StandardPage>
    );
};

export default React.memo(CommunityList);
