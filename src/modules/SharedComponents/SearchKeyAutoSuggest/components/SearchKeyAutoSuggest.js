import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AutoComplete from 'material-ui/AutoComplete';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from 'actions';

export class SearchKeyAutoSuggest extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        searchKeySuggestions: PropTypes.array,
        searchKeyAsPublished: PropTypes.any,
        searchKey: PropTypes.string,
        actions: PropTypes.object.isRequired,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        className: PropTypes.string
    };

    static defaultProps = {
        searchKeySuggestions: [],
        locale: {
            searchKeyAsPublishedLabel: 'Search key',
            searchKeyAsPublishedHint: 'Please type search key value'
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            searchKeyAsPublished: null
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange && nextState.searchKeyAsPublished !== this.state.searchKeyAsPublished) this.props.onChange(nextState.searchKeyAsPublished);
    }

    updateSearchKeyValue = (value) => {
        this.setState({
            searchKeyAsPublished: value
        });
    };

    _onSearchKeyChanged = (searchText, dataSource, params) => {
        this.updateSearchKeyValue(searchText);

        if (searchText.trim().length > 1 && params.source === 'change') {
            this.props.actions.searchKeyLookUp(searchText, this.props.searchKey);
        }
    };

    _onSearchKeySelected = (chosenRequest, index) => {
        if (index === -1) {
            this.updateSearchKeyValue(chosenRequest);
        } else {
            this.updateSearchKeyValue(chosenRequest);
        }
    };

    render() {
        const {disabled, locale, className, searchKeySuggestions} = this.props;
        return (
            <AutoComplete
                disabled={disabled}
                listStyle={{maxHeight: 200, overflow: 'auto'}}
                filter={() => true}
                id="searchKeyAsPublishedField"
                floatingLabelText={locale.searchKeyAsPublishedLabel}
                hintText={locale.searchKeyAsPublishedHint}
                dataSource={searchKeySuggestions}
                openOnFocus
                fullWidth
                animated={false}
                searchText={this.state.searchKeyAsPublished}
                onUpdateInput={this._onSearchKeyChanged}
                onNewRequest={this._onSearchKeySelected}
                className={className}
            />
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        searchKeySuggestions: state.get('searchKeysReducer') && state.get('searchKeysReducer')[ownProps.searchKey] ? state.get('searchKeysReducer')[ownProps.searchKey] : []
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchKeyAutoSuggest);
