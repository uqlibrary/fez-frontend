import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {AutoSuggestField} from '../components/AutoSuggestField';
import {connect} from 'react-redux';
import * as actions from 'actions';

export class OrgNameAutoSuggestField extends Component {
    static propTypes = {
        input: PropTypes.object,
        className: PropTypes.string,
        meta: PropTypes.object,
        floatingLabelText: PropTypes.string,
        hintText: PropTypes.string
    };

    static defaultProps = {
        floatingLabelText: 'Institution',
        hintText: 'Start typing an institution name'
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
    const category = 'org_name';
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

export const OrgNameField = connect(mapStateToProps, mapDispatchToProps)(OrgNameAutoSuggestField);

