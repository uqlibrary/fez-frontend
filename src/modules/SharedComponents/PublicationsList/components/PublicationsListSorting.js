import React from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import ListSubheader from '@mui/material/ListSubheader';

import { ExportPublications } from 'modules/SharedComponents/ExportPublications';
import { userIsAdmin, userIsResearcher } from 'hooks';
import { doesListContainItem } from 'helpers/general';
import { COLLECTION_VIEW_TYPE } from 'config/general';

export const filterCollectionViewTypes = () => COLLECTION_VIEW_TYPE.filter(viewType => viewType.selectable !== false);

const PublicationsListSorting = props => {
    const isAdmin = userIsAdmin();
    const isResearcher = userIsResearcher();

    const txt = locale.components.sorting;

    /* istanbul ignore next */
    const pageLength = txt.recordsPerPage /* istanbul ignore next */ ?? [10, 20, 50, 100];

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

    const initPropDisplayRecordsAs = props.displayRecordsAs || COLLECTION_VIEW_TYPE[0].text;

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

    const selectableCollectionViewType = filterCollectionViewTypes();

    const propDisplayRecordsAs = doesListContainItem(selectableCollectionViewType, initPropDisplayRecordsAs)
        ? initPropDisplayRecordsAs
        : selectableCollectionViewType[0].value ?? /* istanbul ignore next */ '';

    const [sortBy, setSortBy] = React.useState(propSortBy);
    const [sortDirection, setSortDirection] = React.useState(propSortDirection);
    const [pageSize, setPageSize] = React.useState(propPageSize);
    const [displayRecordsAs, setDisplayRecordsAs] = React.useState(propDisplayRecordsAs);

    React.useEffect(() => {
        if (sortBy !== propSortBy) setSortBy(propSortBy);
        if (sortDirection !== propSortDirection) setSortDirection(propSortDirection);
        if (pageSize !== propPageSize) setPageSize(propPageSize);
        if (displayRecordsAs !== propDisplayRecordsAs) setDisplayRecordsAs(propDisplayRecordsAs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propSortBy, propSortDirection, propPageSize, propDisplayRecordsAs]);

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

    const displayRecordsAsChanged = event => {
        setDisplayRecordsAs(event.target.value);
        props.onDisplayRecordsAsChanged(event.target.value);
    };

    const exportPublicationsFormatChanged = value => {
        props.onExportPublications({ exportPublicationsFormat: value });
    };

    if (!props.pagingData || props.pagingData.total === 0 || !sortBy || !sortDirection || !pageSize) {
        return <span className="publicationsListSorting empty" />;
    }

    const dropDownWidth = !!props.showDisplayAs ? 2 : 3;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="sort-by-label" shrink>
                        {props.sortingData.sortLabel}
                    </InputLabel>
                    <Select
                        variant="standard"
                        onChange={sortByChanged}
                        value={sortBy}
                        disabled={props.disabled}
                        labelId="sort-by-label"
                        data-testid="publication-list-sorting-sort-by"
                    >
                        {props.sortingData.sortBy.map((item, index) => {
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
            <Grid item xs={12} sm={6} md={props.canUseExport ? dropDownWidth : dropDownWidth + 1}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="sort-order-label" shrink>
                        {txt.sortDirectionLabel}
                    </InputLabel>
                    <Select
                        variant="standard"
                        onChange={orderDirectionsChanged}
                        value={sortDirection}
                        disabled={props.disabled}
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
            <Grid
                item
                xs={12}
                sm={props.canUseExport ? 6 : 12}
                md={props.canUseExport ? dropDownWidth : dropDownWidth + 1}
            >
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="page-size-label" shrink>
                        {props.sortingData.pageSize}
                    </InputLabel>
                    <Select
                        variant="standard"
                        value={pageSize}
                        disabled={props.disabled}
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
                                    id={`search-export-size-entry-${props.bulkExportSize}`}
                                >
                                    {props.bulkExportSize}
                                </MenuItem>,
                            ]}
                    </Select>
                </FormControl>
            </Grid>
            {!!props.showDisplayAs && (
                <Grid
                    item
                    xs={12}
                    sm={props.canUseExport ? 6 : 12}
                    md={props.canUseExport ? dropDownWidth : dropDownWidth + 1}
                >
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="display-records-as-label" shrink>
                            {props.sortingData.displayRecordsAsLabel}
                        </InputLabel>
                        <Select
                            variant="standard"
                            value={displayRecordsAs}
                            disabled={props.disabled}
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
            {props.canUseExport && (
                <Grid item sm={6} md={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <ExportPublications
                        onChange={exportPublicationsFormatChanged}
                        disabled={props.disabled}
                        exportData={props.exportData}
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

PublicationsListSorting.defaultProps = {
    exportData: {},
    showDisplayAs: false,
    sortingData: locale.components.sorting,
    sortingDefaults: {},
};

export default PublicationsListSorting;
