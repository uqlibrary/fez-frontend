import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {ExportPublications} from 'modules/SharedComponents/ExportPublications';

export default class PublicationsListSorting extends PureComponent {
    static propTypes = {
        sortBy: PropTypes.string,
        sortDirection: PropTypes.string,
        pageSize: PropTypes.number,
        onPageSizeChanged: PropTypes.func,
        onSortByChanged: PropTypes.func,
        pagingData: PropTypes.shape({
            from: PropTypes.number,
            to: PropTypes.number,
            total: PropTypes.number,
            per_page: PropTypes.number,
            current_page: PropTypes.number
        }),
        disabled: PropTypes.bool,
        onExportPublications: PropTypes.func,
        canUseExport: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            sortBy: props.sortBy || locale.components.sorting.sortBy[0].value,
            sortDirection: props.sortDirection || locale.components.sorting.sortDirection[0],
            pageSize: props.pageSize || props.pagingData && props.pagingData.per_page ? props.pagingData.per_page : 20,
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

    pageSizeChanged = (event, index, value) => {
        this.setState({
            pageSize: value,
            exportPublicationsFormat: null
        });
        this.props.onPageSizeChanged(value);
    }

    orderDirectionsChanged = (event, index, value) => {
        this.setState({
            sortDirection: value,
            exportPublicationsFormat: null
        });
        this.props.onSortByChanged(this.state.sortBy, value);
    }

    sortByChanged = (event, index, value) => {
        this.setState({
            sortBy: value,
            exportPublicationsFormat: null
        });
        this.props.onSortByChanged(value, this.state.sortDirection);
    }

    exportPublicationsFormatChanged = (value) => {
        this.setState({
            exportPublicationsFormat: value
        });
        this.props.onExportPublications({exportPublicationsFormat: value});
    }

    render() {
        if (!this.props.pagingData || this.props.pagingData.total === 0) {
            return (
                <span className="publicationsListSorting empty"/>
            );
        }
        const txt = locale.components.sorting;
        return (
            <div className="publicationsListSorting columns is-gapless is-mobile">
                <div className="column">
                    <SelectField
                        id="sortBy"
                        fullWidth
                        maxHeight={250}
                        onChange={this.sortByChanged}
                        value={this.state.sortBy}
                        disabled={this.props.disabled}
                        floatingLabelText={txt.sortLabel}>
                        {
                            txt.sortBy.map((item, index) => {
                                return (
                                    <MenuItem key={index} value={item.value} primaryText={item.label}/>
                                );
                            })
                        }
                    </SelectField>
                </div>
                <div className="column is-narrow is-spacer is-hidden-mobile"/>
                <div className="column is-hidden-mobile">
                    <SelectField
                        id="sortOrder"
                        maxHeight={250}
                        fullWidth
                        onChange={this.orderDirectionsChanged}
                        value={this.state.sortDirection}
                        disabled={this.props.disabled}
                        floatingLabelText={txt.sortDirectionLabel}>
                        {
                            txt.sortDirection.map((item, index) => {
                                return (
                                    <MenuItem key={index} value={item} primaryText={item}/>
                                );
                            })
                        }
                    </SelectField>
                </div>
                <div className="column is-narrow is-spacer is-hidden-mobile"/>
                <div className="column is-hidden-mobile">
                    <SelectField
                        id="pageSize"
                        value={this.state.pageSize}
                        maxHeight={250}
                        fullWidth
                        disabled={this.props.disabled}
                        onChange={this.pageSizeChanged}
                        floatingLabelText={txt.pageSize}>
                        {
                            txt.recordsPerPage.map(number => {
                                return (<MenuItem key={`records-per-page-${number}`} value={number} primaryText={number} />);
                            })
                        }
                    </SelectField>
                </div>
                {
                    this.props.canUseExport &&
                    <div className="column is-narrow is-spacer is-hidden-mobile is-hidden-tablet-only"/>
                }
                {
                    this.props.canUseExport &&
                    <div className="column is-hidden-mobile is-hidden-tablet-only">
                        <ExportPublications
                            format={this.state.exportPublicationsFormat}
                            onChange={this.exportPublicationsFormatChanged}
                            disabled={this.props.disabled}/>
                    </div>
                }
            </div>

        );
    }
}
