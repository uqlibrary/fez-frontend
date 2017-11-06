import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {AutoSuggestField} from '../components/AutoSuggestField';
import {connect} from 'react-redux';
import * as actions from 'actions';
import {validation} from 'config';


export class JournalNameAutoSuggestField extends Component {
    static propTypes = {
        input: PropTypes.object,
        className: PropTypes.string,
        validate: PropTypes.func
    };

    static defaultProps = {
        locale: {
            fieldLabel: 'Journal name',
            fieldHint: 'Start typing journal name'
        },
        validate: validation.required
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AutoSuggestField
                onChange={this.props.input.onChange}
                async
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

