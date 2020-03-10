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
        onChange: item => props.input.onChange(item),
        onClear: () => props.input.onChange(null),
        defaultValue:
            (!!props.input.value && (props.input.value.toJS ? props.input.value.toJS() : props.input.value)) || null,
        getOptionLabel: item => (!!item && String(`${item.id} (${item.value})`)) || '',
        filterOptions: (options, { inputValue }) => matchSorter(options, inputValue, { keys: ['id', 'value'] }),
        error: (!!props.meta && !!props.meta.error) || props.error,
        errorText: (!!props.meta && !!props.meta.error && props.meta.error) || (props.error && props.errorText) || '',
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

export function AuthorIdFormField(fieldProps) {
    return <AuthorIdAutoComplete {...fieldProps} />;
}
