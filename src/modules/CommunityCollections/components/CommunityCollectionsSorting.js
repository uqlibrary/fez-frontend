import React from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

const CommunityCollectionsSorting = props => {
    const [sortBy, setSortBy] = React.useState(props.sortBy || locale.components.sorting.sortBy[0].value);
    const [sortDirection, setSortDirection] = React.useState(
        props.sortDirection || locale.components.sorting.sortDirection[0],
    );
    const [pageSize, setPageSize] = React.useState(
        props.pageSize || (props.pagingData && props.pagingData.per_page ? props.pagingData.per_page : 20),
    );

    React.useEffect(() => {
        if (sortBy !== props.sortBy) setSortBy(props.sortBy);
        if (sortDirection !== props.sortDirection) setSortDirection(props.sortDirection);
        if (pageSize !== props.pageSize) setPageSize(props.pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.sortBy, props.sortDirection, props.pageSize]);

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
    if (!props.pagingData || props.pagingData.total === 0 || !sortBy || !sortDirection || !pageSize) {
        return <span className="publicationsListSorting empty" />;
    }
    const txt = props.sortingData;
    const pageLength = txt.recordsPerPage;
    if (props.initPageLength && pageLength.indexOf(props.initPageLength) === -1) {
        pageLength.push(props.initPageLength);
        pageLength.sort((a, b) => a - b);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={props.isCollection ? 8 : 12} sm={6} md={props.canUseExport ? 3 : 4}>
                <FormControl fullWidth>
                    <InputLabel shrink>{txt.sortLabel}</InputLabel>
                    <Select id="sortBy" onChange={sortByChanged} value={sortBy} disabled={props.disabled}>
                        {txt.sortBy.map((item, index) => {
                            return (
                                <MenuItem key={index} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={props.isCollection ? 8 : 12} sm={6} md={props.canUseExport ? 3 : 4}>
                <FormControl fullWidth>
                    <InputLabel shrink>{txt.sortDirectionLabel}</InputLabel>
                    <Select
                        id="sortOrder"
                        onChange={orderDirectionsChanged}
                        value={sortDirection}
                        disabled={props.disabled}
                    >
                        {txt.sortDirection.map((item, index) => {
                            return (
                                <MenuItem key={index} value={item}>
                                    {item}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid
                item
                xs={props.isCollection ? 8 : 12}
                sm={props.canUseExport ? 6 : 12}
                md={props.canUseExport ? 3 : 4}
            >
                <FormControl fullWidth>
                    <InputLabel shrink>{txt.pageSize}</InputLabel>
                    <Select id="pageSize" value={pageSize} disabled={props.disabled} onChange={pageSizeChanged}>
                        {pageLength.map(number => {
                            return (
                                <MenuItem key={`records-per-page-${number}`} value={number}>
                                    {number}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

CommunityCollectionsSorting.propTypes = {
    bulkExportSize: PropTypes.number,
    canUseExport: PropTypes.bool,
    disabled: PropTypes.bool,
    initPageLength: PropTypes.number,
    onExportPublications: PropTypes.func,
    onPageSizeChanged: PropTypes.func,
    onSortByChanged: PropTypes.func,
    pageSize: PropTypes.number,
    pagingData: PropTypes.shape({
        from: PropTypes.number,
        to: PropTypes.number,
        total: PropTypes.number,
        per_page: PropTypes.number,
        current_page: PropTypes.number,
    }),
    sortBy: PropTypes.string,
    sortDirection: PropTypes.string,
    sortingData: PropTypes.object,
    isCollection: PropTypes.bool,
};

export default CommunityCollectionsSorting;
