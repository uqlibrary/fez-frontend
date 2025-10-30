import React from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/GridLegacy';
import ListSubheader from '@mui/material/ListSubheader';

import { ExportPublications } from 'modules/SharedComponents/ExportPublications';
import { userIsAdmin, userIsResearcher } from 'hooks';
import { doesListContainItem } from 'helpers/general';
import { COLLECTION_VIEW_TYPE } from 'config/general';

export const filterCollectionViewTypes = () => COLLECTION_VIEW_TYPE.filter(viewType => viewType.selectable !== false);

const PublicationsListSorting = ({
    bulkExportSize,
    canUseExport,
    exportData = {},
    disabled,
    initPageLength,
    onExportPublications,
    onPageSizeChanged,
    onSortByChanged,
    pageSize,
    showDisplayAs = false,
    sortingData = locale.components.sorting,
    pagingData,
    sortingDefaults = {},
    sortBy,
    sortDirection,
    onDisplayRecordsAsChanged,
    displayRecordsAs,
}) => {
    const isAdmin = userIsAdmin();
    const isResearcher = userIsResearcher();

    const txt = locale.components.sorting;

    /* c8 ignore next */
    const pageLength = txt.recordsPerPage /* c8 ignore next */ ?? [10, 20, 50, 100];

    // Allow cust page length if defined in props
    if (initPageLength && pageLength.indexOf(initPageLength) === -1) {
        pageLength.push(initPageLength);
        pageLength.sort((a, b) => a - b);
    }

    // get initial values from props
    const initPropSortBy = sortBy || sortingData.sortBy[0].value;
    const initPropSortDirection = sortDirection || locale.components.sorting.sortDirection[0];
    const initPropPageSize =
        initPageLength || pageSize || (pagingData && pagingData.per_page ? pagingData.per_page : 20);

    const initPropDisplayRecordsAs = displayRecordsAs || COLLECTION_VIEW_TYPE[0].text;

    // sanitise values
    const propSortBy = doesListContainItem(sortingData.sortBy, initPropSortBy)
        ? initPropSortBy
        : (sortingDefaults.sortBy ?? sortingData.sortBy[0].value);
    const propSortDirection = doesListContainItem(locale.components.sorting.sortDirection, initPropSortDirection)
        ? initPropSortDirection
        : (sortingDefaults.sortDirection ?? locale.components.sorting.sortDirection[0]);
    const propPageSize = doesListContainItem(pageLength, initPropPageSize)
        ? initPropPageSize
        : (sortingDefaults.pageSize ?? pageLength[0]);

    const selectableCollectionViewType = filterCollectionViewTypes();

    const propDisplayRecordsAs = doesListContainItem(selectableCollectionViewType, initPropDisplayRecordsAs)
        ? initPropDisplayRecordsAs
        : (selectableCollectionViewType[0].value ?? /* c8 ignore next */ '');

    const [sortByState, setSortByState] = React.useState(propSortBy);
    const [sortDirectionState, setSortDirectionState] = React.useState(propSortDirection);
    const [pageSizeState, setPageSizeState] = React.useState(propPageSize);
    const [displayRecordsAsState, setDisplayRecordsAsState] = React.useState(propDisplayRecordsAs);

    React.useEffect(() => {
        if (sortByState !== propSortBy) setSortByState(propSortBy);
        if (sortDirectionState !== propSortDirection) setSortDirectionState(propSortDirection);
        if (pageSizeState !== propPageSize) setPageSizeState(propPageSize);
        if (displayRecordsAsState !== propDisplayRecordsAs) setDisplayRecordsAsState(propDisplayRecordsAs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propSortBy, propSortDirection, propPageSize, propDisplayRecordsAs]);

    const pageSizeChanged = event => {
        setPageSizeState(event.target.value);
        onPageSizeChanged(event.target.value);
    };

    const orderDirectionsChanged = event => {
        setSortDirectionState(event.target.value);
        onSortByChanged(sortByState, event.target.value);
    };

    const sortByChanged = event => {
        setSortByState(event.target.value);
        onSortByChanged(event.target.value, sortDirectionState);
    };

    const displayRecordsAsChanged = event => {
        setDisplayRecordsAsState(event.target.value);
        onDisplayRecordsAsChanged(event.target.value);
    };

    const exportPublicationsFormatChanged = value => {
        onExportPublications({ exportPublicationsFormat: value });
    };

    if (!pagingData || pagingData.total === 0 || !sortByState || !sortDirectionState || !pageSizeState) {
        return <span className="publicationsListSorting empty" />;
    }

    const dropDownWidth = !!showDisplayAs ? 2 : 3;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="sort-by-label" shrink>
                        {sortingData.sortLabel}
                    </InputLabel>
                    <Select
                        variant="standard"
                        onChange={sortByChanged}
                        value={sortByState}
                        disabled={disabled}
                        labelId="sort-by-label"
                        data-testid="publication-list-sorting-sort-by"
                    >
                        {sortingData.sortBy.map((item, index) => {
                            return (
                                <MenuItem
                                    key={index}
                                    value={item.value}
                                    data-testid={`publication-list-sorting-sort-by-option-${index}`}
                                    id={`publication-list-sorting-sort-by-option-${index}`}
                                >
                                    {item.label}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={canUseExport ? dropDownWidth : dropDownWidth + 1}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="sort-order-label" shrink>
                        {txt.sortDirectionLabel}
                    </InputLabel>
                    <Select
                        variant="standard"
                        onChange={orderDirectionsChanged}
                        value={sortDirectionState}
                        disabled={disabled}
                        labelId="sort-order-label"
                        data-testid="publication-list-sorting-sort-order"
                    >
                        {txt.sortDirection.map((item, index) => {
                            return (
                                <MenuItem
                                    key={index}
                                    value={item}
                                    data-testid={`publication-list-sorting-sort-order-option-${index}`}
                                    id={`publication-list-sorting-sort-order-option-${index}`}
                                >
                                    {item}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={canUseExport ? 6 : 12} md={canUseExport ? dropDownWidth : dropDownWidth + 1}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="page-size-label" shrink>
                        {sortingData.pageSize}
                    </InputLabel>
                    <Select
                        variant="standard"
                        value={pageSizeState}
                        disabled={disabled}
                        onChange={pageSizeChanged}
                        labelId="page-size-label"
                        data-testid="publication-list-sorting-page-size"
                    >
                        {pageLength.map(number => {
                            return (
                                <MenuItem
                                    key={`records-per-page-${number}`}
                                    value={number}
                                    data-testid={`publication-list-sorting-page-size-option-${number}`}
                                    id={`publication-list-sorting-page-size-option-${number}`}
                                >
                                    {number}
                                </MenuItem>
                            );
                        })}
                        {canUseExport &&
                            (isAdmin || isResearcher) &&
                            !!bulkExportSize && [
                                <ListSubheader key="export-heading" data-testid="search-export-size-heading">
                                    {txt.exportOnlyLabel}
                                </ListSubheader>,
                                <MenuItem
                                    key={`records-per-page-${bulkExportSize}`}
                                    value={bulkExportSize}
                                    data-testid={`search-export-size-entry-${bulkExportSize}`}
                                    id={`search-export-size-entry-${bulkExportSize}`}
                                >
                                    {bulkExportSize}
                                </MenuItem>,
                            ]}
                    </Select>
                </FormControl>
            </Grid>
            {!!showDisplayAs && (
                <Grid item xs={12} sm={canUseExport ? 6 : 12} md={canUseExport ? dropDownWidth : dropDownWidth + 1}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="display-records-as-label" shrink>
                            {sortingData.displayRecordsAsLabel}
                        </InputLabel>
                        <Select
                            variant="standard"
                            value={displayRecordsAsState}
                            disabled={disabled}
                            onChange={displayRecordsAsChanged}
                            labelId="display-records-as-label"
                            data-testid="publication-list-display-records-as"
                        >
                            {selectableCollectionViewType.map(item => {
                                return (
                                    <MenuItem
                                        key={item.id}
                                        value={item.value}
                                        data-testid={`publication-display-records-as-option-${item.id}`}
                                        id={`publication-display-records-as-option-${item.id}`}
                                    >
                                        {item.label}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
            )}
            {canUseExport && (
                <Grid item sm={6} md={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <ExportPublications
                        onChange={exportPublicationsFormatChanged}
                        disabled={disabled}
                        exportData={exportData}
                    />
                </Grid>
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
    showDisplayAs: PropTypes.bool,
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
    onDisplayRecordsAsChanged: PropTypes.func,
    displayRecordsAs: PropTypes.string,
};

export default PublicationsListSorting;
