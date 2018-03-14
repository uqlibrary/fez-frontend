import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class PublicationsListSorting extends Component {
    static propTypes = {
        onPageSizeChanged: PropTypes.func,
        onSortByChanged: PropTypes.func,
        pagingData: PropTypes.shape({
            from: PropTypes.number,
            to: PropTypes.number,
            total: PropTypes.number,
            per_page: PropTypes.number,
            current_page: PropTypes.number
        }),
        disabled: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            sortBy: locale.components.sorting.sortBy[0].value,
            sortDirection: locale.components.sorting.sortDirection[0],
            pageSize: props.pagingData && props.pagingData.per_page ? props.pagingData.per_page : 20
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.pagingData.per_page !== this.props.pagingData.per_page) {
            this.setState(nextProps.pagingData);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.pageSize !== this.state.pageSize && this.props.onPageSizeChanged) {
            this.props.onPageSizeChanged(nextState.pageSize);
        }

        if ((nextState.sortBy !== this.state.sortBy || nextState.sortDirection !== this.state.sortDirection)
            && this.props.onSortByChanged) {
            this.props.onSortByChanged(nextState.sortBy, nextState.sortDirection);
        }
    }

    pageSizeChanged = (event, index, value) => {
        this.setState({
            pageSize: value
        });
    }

    orderDirectionsChanged = (event, index, value) => {
        this.setState({
            sortDirection: value
        });
    }

    sortByChanged =  (event, index, value) => {
        this.setState({
            sortBy: value
        });
    }

    render() {
        if (!this.props.pagingData || this.props.pagingData.total === 0) return (<span className="publicationsListSorting empty"/>);
        const txt = locale.components.sorting;
        return (
            <div className="publicationsListSorting columns is-gapless is-mobile is-multiline">
                <div className="column is-12-mobile">
                    <SelectField
                        id="sortBy"
                        maxHeight={250}
                        fullWidth
                        onChange={this.sortByChanged}
                        value={this.state.sortBy}
                        disabled={this.props.disabled}
                        floatingLabelText={txt.sortLabel}>
                        {
                            txt.sortBy.map((item, index) => {
                                return (<MenuItem key={index} value={item.value} primaryText={item.label}/>);
                            })
                        }
                    </SelectField>
                </div>
                <div className="column is-narrow is-spacer is-hidden-mobile" />
                <div className="column is-12-mobile">
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
                                return (<MenuItem key={index} value={item} primaryText={item}/>);
                            })
                        }
                    </SelectField>
                </div>
                <div className="column is-narrow is-spacer is-hidden-mobile" />
                <div className="column is-hidden-mobile">
                    <SelectField
                        id="pageSize"
                        value={this.state.pageSize}
                        maxHeight={250}
                        fullWidth
                        disabled={this.props.disabled}
                        onChange={this.pageSizeChanged}
                        floatingLabelText={txt.pageSize}>
                        <MenuItem value={20} primaryText={20} />
                        <MenuItem value={50} primaryText={50}/>
                        <MenuItem value={100} primaryText={100}/>
                        <MenuItem value={1000} primaryText={1000}/>
                    </SelectField>
                </div>
            </div>

        );
    }
}
