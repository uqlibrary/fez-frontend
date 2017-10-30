import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {AutoSuggestField} from '../components/AutoSuggestField';
import {connect} from 'react-redux';
import * as actions from 'actions';
import {validation} from 'config';


export class NewspaperNameAutoSuggestField extends Component {
    static propTypes = {
        input: PropTypes.object,
        className: PropTypes.string,
        validate: PropTypes.func
    };

    static defaultProps = {
        locale: {
            fieldLabel: 'Newspaper name',
            fieldHint: 'Start typing newspaper name'
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

export const NewspaperNameField = connect(mapStateToProps, mapDispatchToProps)(NewspaperNameAutoSuggestField);

