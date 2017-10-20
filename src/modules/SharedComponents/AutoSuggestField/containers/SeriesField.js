import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {AutoSuggestField} from '../components/AutoSuggestField';
import {connect} from 'react-redux';
import * as actions from 'actions';

export class SeriesAutoSuggestField extends Component {
    static propTypes = {
        input: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AutoSuggestField
                onChange={this.props.input.onChange}
                async
                locale={{
                    fieldLabel: 'Series',
                    fieldHint: 'Start typing series name'
                }}
                {...this.props} />
        );
    }
}

const mapStateToProps = (state) => {
    const category = 'series';
    return {
        category: category,
        itemsList: state.get('searchKeysReducer') && state.get('searchKeysReducer')[category]
            ? state.get('searchKeysReducer')[category].itemsList : []
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (searchKey, searchQuery = ' ') => dispatch(actions.loadSearchKeyList(searchKey, searchQuery))
    }
);

export const SeriesField = connect(mapStateToProps, mapDispatchToProps)(SeriesAutoSuggestField);

