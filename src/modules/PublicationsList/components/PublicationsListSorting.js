import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'config';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class PublicationsListSorting extends Component {
    static propTypes = {
        onPageSizeChanged: PropTypes.func,
        onSortByChanged: PropTypes.func,
        pagingData: PropTypes.object,
        disabled: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            sortBy: locale.components.sorting.sortBy[0].value,
            sortDirection: locale.components.sorting.sortDirection[0],
            pageSize: this.props.pagingData && this.props.pagingData.per_page ? this.props.pagingData.per_page : 20
        };
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
        const txt = locale.components.sorting;
        return (
            <div className="publicationsListSorting columns is-mobile">
                <div className="column">
                    <SelectField
                        id="sortBy"
                        maxHeight={250}
                        autoWidth
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
                <div className="column">
                    <SelectField
                        id="sortBy"
                        maxHeight={250}
                        autoWidth
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
                <div className="column">
                    <SelectField
                        id="pageSize"
                        value={this.state.pageSize}
                        maxHeight={250}
                        autoWidth
                        disabled={this.props.disabled}
                        onChange={this.pageSizeChanged}
                        floatingLabelText={txt.pageSize}>
                        <MenuItem value={20} primaryText={20}/>
                        <MenuItem value={50} primaryText={50}/>
                        <MenuItem value={100} primaryText={100}/>
                        <MenuItem value={1000} primaryText={1000}/>
                    </SelectField>
                </div>
            </div>

        );
    }
}
