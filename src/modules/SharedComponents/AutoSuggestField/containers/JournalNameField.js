import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {AutoSuggestField} from '../components/AutoSuggestField';
import {connect} from 'react-redux';
import * as actions from 'actions';

export class JournalNameAutoSuggestField extends Component {
    static propTypes = {
        input: PropTypes.object,
        className: PropTypes.string,
        meta: PropTypes.object,
        floatingLabelText: PropTypes.string,
        hintText: PropTypes.string
    };

    static defaultProps = {
        floatingLabelText: 'Journal name',
        hintText: 'Start typing journal name'
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AutoSuggestField
                onChange={this.props.input.onChange}
                async
                errorText={this.props.meta.error}
                {...this.props} />
        );
    }
}

const mapStateToProps = (state) => {
    const category = 'journal_name';
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

export const JournalNameField = connect(mapStateToProps, mapDispatchToProps)(JournalNameAutoSuggestField);

