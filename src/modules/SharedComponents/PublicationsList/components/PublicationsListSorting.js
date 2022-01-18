import React from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import ListSubheader from '@material-ui/core/ListSubheader';

import { ExportPublications } from 'modules/SharedComponents/ExportPublications';
import { userIsAdmin, userIsResearcher } from 'hooks';
import { doesListContainItem } from 'helpers/general';

const PublicationsListSorting = props => {
    const txt = locale.components.sorting;
    /* istanbul ignore next */
    const pageLength = txt.recordsPerPage ?? [10, 20, 50, 100];

    // Allow cust page length if defined in props
    if (props.initPageLength && pageLength.indexOf(props.initPageLength) === -1) {
        pageLength.push(props.initPageLength);
        pageLength.sort((a, b) => a - b);
    }

    // get initial values from props
    const initPropSortBy = props.sortBy || props.sortingData.sortBy[0].value;
    const initPropSortDirection = props.sortDirection || locale.components.sorting.sortDirection[0];
    const initPropPageSize =
        props.initPageLength ||
        props.pageSize ||
        (props.pagingData && props.pagingData.per_page ? props.pagingData.per_page : 20);

    // sanitise values
    const propSortBy = doesListContainItem(props.sortingData.sortBy, initPropSortBy)
        ? initPropSortBy
        : props.sortingDefaults.sortBy ?? props.sortingData.sortBy[0].value;
    const propSortDirection = doesListContainItem(locale.components.sorting.sortDirection, initPropSortDirection)
        ? initPropSortDirection
        : props.sortingDefaults.sortDirection ?? locale.components.sorting.sortDirection[0];
    const propPageSize = doesListContainItem(pageLength, initPropPageSize)
        ? initPropPageSize
        : props.sortingDefaults.pageSize ?? pageLength[0];

    const [sortBy, setSortBy] = React.useState(propSortBy);
    const [sortDirection, setSortDirection] = React.useState(propSortDirection);
    const [pageSize, setPageSize] = React.useState(propPageSize);

    React.useEffect(() => {
        if (sortBy !== propSortBy) setSortBy(propSortBy);
        if (sortDirection !== propSortDirection) setSortDirection(propSortDirection);
        if (pageSize !== propPageSize) setPageSize(propPageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propSortBy, propSortDirection, propPageSize]);

    const pageSizeChanged = event => {
        setPageSize(event.target.value);
        props.onPageSizeChanged(event.target.value);
    };

    const orderDirectionsChanged = event => {
        setSortDirection(event.target.value);
        props.onSortByChanged(sortBy, event.target.value);
    };

    const sortByChanged = event => {
        setSortBy(event.target.value);
        props.onSortByChanged(event.target.value, sortDirection);
    };

    const exportPublicationsFormatChanged = value => {
        props.onExportPublications({ exportPublicationsFormat: value });
    };

    if (!props.pagingData || props.pagingData.total === 0 || !sortBy || !sortDirection || !pageSize) {
        return <span className="publicationsListSorting empty" />;
    }

    const isAdmin = userIsAdmin();
    const isResearcher = userIsResearcher();

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={props.canUseExport ? 3 : 4}>
                <FormControl fullWidth>
                    <InputLabel shrink>{props.sortingData.sortLabel}</InputLabel>
                    <Select
                        id="sortBy"
                        onChange={sortByChanged}
                        value={sortBy}
                        disabled={props.disabled}
                        data-testid="publication-list-sorting-sort-by"
                    >
                        {props.sortingData.sortBy.map((item, index) => {
                            return (
                                <MenuItem key={index} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={props.canUseExport ? 3 : 4}>
                <FormControl fullWidth>
                    <InputLabel shrink>{txt.sortDirectionLabel}</InputLabel>
                    <Select
                        id="sortOrder"
                        onChange={orderDirectionsChanged}
                        value={sortDirection}
                        disabled={props.disabled}
                        data-testid="publication-list-sorting-sort-order"
                    >
                        {txt.sortDirection.map((item, index) => {
                            return (
                                <MenuItem
                                    key={index}
                                    value={item}
                                    data-testid={`publication-list-sorting-sort-order-option-${index}`}
                                >
                                    {item}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={props.canUseExport ? 6 : 12} md={props.canUseExport ? 3 : 4}>
                <FormControl fullWidth>
                    <InputLabel shrink>{props.sortingData.pageSize}</InputLabel>
                    <Select
                        id="pageSize"
                        value={pageSize}
                        disabled={props.disabled}
                        onChange={pageSizeChanged}
                        data-testid="publication-list-sorting-page-size"
                    >
                        {pageLength.map(number => {
                            return (
                                <MenuItem key={`records-per-page-${number}`} value={number}>
                                    {number}
                                </MenuItem>
                            );
                        })}
                        {props.canUseExport &&
                            (isAdmin || isResearcher) &&
                            !!props.bulkExportSize && [
                                <ListSubheader key="export-heading" data-testid="search-export-size-heading">
                                    {txt.exportOnlyLabel}
                                </ListSubheader>,
                                <MenuItem
                                    key={`records-per-page-${props.bulkExportSize}`}
                                    value={props.bulkExportSize}
                                    data-testid={`search-export-size-entry-${props.bulkExportSize}`}
                                >
                                    {props.bulkExportSize}
                                </MenuItem>,
                            ]}
                    </Select>
                </FormControl>
            </Grid>
            {props.canUseExport && (
                <Hidden xsDown>
                    <Grid item sm={6} md={3}>
                        <ExportPublications
                            onChange={exportPublicationsFormatChanged}
                            disabled={props.disabled}
                            exportData={props.exportData}
                        />
                    </Grid>
                </Hidden>
            )}
        </Grid>
    );
};

PublicationsListSorting.propTypes = {
    bulkExportSize: PropTypes.number,
    canUseExport: PropTypes.bool,
    exportData: PropTypes.object,
    disabled: PropTypes.bool,
    initPageLength: PropTypes.number,
    onExportPublications: PropTypes.func,
    onPageSizeChanged: PropTypes.func,
    onSortByChanged: PropTypes.func,
    pageSize: PropTypes.number,
    sortingData: PropTypes.object,
    pagingData: PropTypes.shape({
        from: PropTypes.number,
        to: PropTypes.number,
        total: PropTypes.number,
        per_page: PropTypes.number,
        current_page: PropTypes.number,
    }),
    sortingDefaults: PropTypes.shape({
        sortDirection: PropTypes.string,
        sortBy: PropTypes.string,
        pageSize: PropTypes.number,
    }),
    sortBy: PropTypes.string,
    sortDirection: PropTypes.string,
};

PublicationsListSorting.defaultProps = {
    exportData: {},
    sortingData: locale.components.sorting,
    sortingDefaults: {},
};

export default PublicationsListSorting;
