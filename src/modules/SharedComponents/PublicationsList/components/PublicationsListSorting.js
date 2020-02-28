import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { ExportPublications } from 'modules/SharedComponents/ExportPublications';
import { withStyles } from '@material-ui/core/styles';

const styles = {};

export class PublicationsListSorting extends PureComponent {
    static propTypes = {
        sortBy: PropTypes.string,
        sortDirection: PropTypes.string,
        pageSize: PropTypes.number,
        initPageLength: PropTypes.number,
        onPageSizeChanged: PropTypes.func,
        onSortByChanged: PropTypes.func,
        pagingData: PropTypes.shape({
            from: PropTypes.number,
            to: PropTypes.number,
            total: PropTypes.number,
            per_page: PropTypes.number,
            current_page: PropTypes.number,
        }),
        disabled: PropTypes.bool,
        onExportPublications: PropTypes.func,
        canUseExport: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {
            sortBy: props.sortBy || locale.components.sorting.sortBy[0].value || 'published_date',
            sortDirection: props.sortDirection || locale.components.sorting.sortDirection[0] || 'Desc',
            pageSize:
                props.pageSize || (props.pagingData && props.pagingData.per_page) ? props.pagingData.per_page : 20,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            sortBy: nextProps.sortBy,
            sortDirection: nextProps.sortDirection,
            pageSize: nextProps.pageSize,
            ...nextProps.pagingData,
        });
    }

    pageSizeChanged = event => {
        this.setState({
            pageSize: event.target.value,
            exportPublicationsFormat: null,
        });
        this.props.onPageSizeChanged(event.target.value);
    };

    orderDirectionsChanged = event => {
        this.setState({
            sortDirection: event.target.value,
            exportPublicationsFormat: null,
        });
        this.props.onSortByChanged(this.state.sortBy, event.target.value);
    };

    sortByChanged = event => {
        this.setState({
            sortBy: event.target.value,
            exportPublicationsFormat: null,
        });
        this.props.onSortByChanged(event.target.value, this.state.sortDirection);
    };

    exportPublicationsFormatChanged = value => {
        this.setState({
            exportPublicationsFormat: value,
        });
        this.props.onExportPublications({ exportPublicationsFormat: value });
    };

    render() {
        if (
            !this.props.pagingData ||
            this.props.pagingData.total === 0 ||
            !this.state.sortBy ||
            !this.state.sortDirection ||
            !this.state.pageSize
        ) {
            return <span className="publicationsListSorting empty" />;
        }
        const txt = locale.components.sorting;
        const pageLength = txt.recordsPerPage;
        if (this.props.initPageLength && pageLength.indexOf(this.props.initPageLength) === -1) {
            pageLength.push(this.props.initPageLength);
            pageLength.sort((a, b) => a - b);
        }
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={this.props.canUseExport ? 3 : 4}>
                    <FormControl fullWidth>
                        <InputLabel shrink>{txt.sortLabel}</InputLabel>
                        <Select
                            id="sortBy"
                            onChange={this.sortByChanged}
                            value={this.state.sortBy}
                            disabled={this.props.disabled}
                        >
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
                <Grid item xs={12} sm={6} md={this.props.canUseExport ? 3 : 4}>
                    <FormControl fullWidth>
                        <InputLabel shrink>{txt.sortDirectionLabel}</InputLabel>
                        <Select
                            id="sortOrder"
                            onChange={this.orderDirectionsChanged}
                            value={this.state.sortDirection}
                            disabled={this.props.disabled}
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
                <Grid item xs={12} sm={this.props.canUseExport ? 6 : 12} md={this.props.canUseExport ? 3 : 4}>
                    <FormControl fullWidth>
                        <InputLabel shrink>{txt.pageSize}</InputLabel>
                        <Select
                            id="pageSize"
                            value={this.state.pageSize}
                            disabled={this.props.disabled}
                            onChange={this.pageSizeChanged}
                        >
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
                {this.props.canUseExport && (
                    <Hidden xsDown>
                        <Grid item sm={6} md={3}>
                            <ExportPublications
                                format={this.state.exportPublicationsFormat}
                                onChange={this.exportPublicationsFormatChanged}
                                disabled={this.props.disabled}
                            />
                        </Grid>
                    </Hidden>
                )}
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(PublicationsListSorting);
