import React from 'react';
import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';
import matchSorter from 'match-sorter';
import { GenericOptionTemplate } from 'modules/SharedComponents/LookupFields';

const mapStateToProps = (state, props) => {
    return {
        id: props.id,
        itemsList:
            state.get('searchKeysReducer') && state.get('searchKeysReducer').author
                ? state.get('searchKeysReducer').author.itemsList.filter(item => !!item.id && item.id !== 0)
                : [],
        onChange: item => props.onChange(item),
        onClear: () => props.onChange(null),
        getOptionLabel: item => (!!item && String(`${item.id} (${item.value})`)) || '',
        filterOptions: (options, { inputValue }) => matchSorter(options, inputValue, { keys: ['id', 'value'] }),
        error: props.error,
        errorText: (props.error && props.errorText) || '',
        OptionTemplate: GenericOptionTemplate,
    };
};

const mapDispatchToProps = dispatch => ({
    loadSuggestions: (searchQuery = ' ') => dispatch(actions.loadSearchKeyList('author', searchQuery)),
});

const AuthorIdAutoComplete = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AutoCompleteAsynchronousField);

export function AuthorIdField(fieldProps) {
    return <AuthorIdAutoComplete {...fieldProps} />;
}
