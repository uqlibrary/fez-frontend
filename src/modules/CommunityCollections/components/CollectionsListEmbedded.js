import React from 'react';
import Box from '@material-ui/core/Box';
import * as actions from 'actions';
import { useSelector, useDispatch } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { pathConfig } from 'config';
import ReactHtmlParser from 'react-html-parser';
import AdminActions from './AdminActions';
import PropTypes from 'prop-types';
import Collapse from '@material-ui/core/Collapse';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import CommunityCollectionsPaging from './CommunityCollectionsPaging';
import CommunityCollectionsSorting from './CommunityCollectionsSorting';
import Button from '@material-ui/core/Button';
import { communityCollectionsConfig } from 'config';
import Add from '@material-ui/icons/Add';

const moment = require('moment');

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    dateCell: {
        minWidth: 120,
    },
});
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
                    style={{ backgroundColor: '#eee', padding: 20, boxShadow: 'inset 0px 2px 4px 0px rgba(0,0,0,0.2)' }}
                    data-testid={`collection-records-${pid}`}
                    id={`collection-records-${pid}`}
                >
                    {!!adminUser && (
                        <Button
                            style={{ marginBottom: 10, backgroundColor: '#51247A', color: 'white' }}
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
                            <Box style={{ minHeight: 200, backgroundColor: 'white', padding: 10 }}>
                                <Typography variant="caption" style={{ fontWeight: 600 }}>
                                    {`Displaying ${PagingData.from} to ${PagingData.to} of ${PagingData.total} collections for '${title}'`}
                                </Typography>
                                <CommunityCollectionsSorting
                                    data-testid="embedded-collections-sorting-top"
                                    // canUseExport
                                    exportData={conf.export}
                                    pagingData={PagingData}
                                    sortingData={conf.sorting}
                                    sortBy={sortBy}
                                    sortDirection={sortDirection}
                                    // onExportPublications={handleExport}
                                    onSortByChanged={sortByChanged}
                                    onPageSizeChanged={pageSizeChanged}
                                    pageSize={PagingData.per_page}
                                    isCollection
                                    // sortingDefaults={sortingDefaults}
                                />

                                <CommunityCollectionsPaging
                                    loading={false}
                                    pagingData={PagingData}
                                    onPageChanged={pageChanged}
                                    disabled={false}
                                    pagingId="embedded-collections-paging-top"
                                    data-testid="embedded-collections-paging-top"
                                />
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow data-testid="embedded-collections-primary-header">
                                            <TableCell>{labels.title}</TableCell>
                                            <TableCell className={classes.dateCell}>{labels.creation_date}</TableCell>
                                            <TableCell className={classes.dateCell}>{labels.updated_date}</TableCell>
                                            <TableCell className={classes.dateCell}>Explore</TableCell>
                                            {!!adminUser && <TableCell>{labels.actions}</TableCell>}
                                        </TableRow>
                                    </TableHead>

                                    <TableBody data-testid="embedded-collections-primary-body">
                                        {finalList.data.map(row => (
                                            <TableRow key={row.rek_pid} data-testid={`row-${row.rek_pid}`}>
                                                <TableCell component="th" scope="row">
                                                    <Typography variant="body2">
                                                        <Link to={pathConfig.records.view(row.rek_pid)}>
                                                            {ReactHtmlParser(row.rek_title)}
                                                        </Link>
                                                    </Typography>
                                                    {!!row.rek_description && (
                                                        <Typography variant="caption">{row.rek_description}</Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell className={classes.dateCell}>
                                                    {moment(row.rek_created_date)
                                                        .local()
                                                        .format(conf.dateFormat)}
                                                </TableCell>
                                                <TableCell className={classes.dateCell}>
                                                    {moment(row.rek_updated_date)
                                                        .local()
                                                        .format(conf.dateFormat)}
                                                </TableCell>
                                                <TableCell>
                                                    <Link to={`/records/search?${encodeLink(row.rek_pid)}`}>View</Link>
                                                </TableCell>
                                                {!!adminUser && (
                                                    <TableCell>
                                                        <AdminActions record={row.rek_pid} />
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <CommunityCollectionsPaging
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
