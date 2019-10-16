import React from 'react';
import { AutoCompleteAsyncField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const category = 'author';
    return {
        category: category,
        itemsList:
            state.get('searchKeysReducer') && state.get('searchKeysReducer')[category]
                ? state.get('searchKeysReducer')[category].itemsList.filter(item => !!item.id && item.id !== 0)
                : [],
        onChange: item => {
            if (!item.id) {
                !!props.input
                    ? props.input.onChange({ ...item, id: `${parseInt(item.value, 10)}` })
                    : props.onChange({ ...item, id: `${parseInt(item.value, 10)}` });
            } else {
                !!props.input ? props.input.onChange(item) : props.onChange(item);
            }
        },
        onClear: () => props.input.onChange(null),
        allowFreeText: true,
        async: true,
        selectedValue:
            (!props.input &&
                ((!!props.label && { value: props.label }) || (!!props.value && { value: props.value }))) ||
            (!!props.input && props.input.value.toJS ? props.input.value.toJS() : props.input.value || '') ||
            '',
        itemToString: item => (!!item && String(`${item.id} (${item.value})`)) || '',
        maxResults: 50,
        error: (!!props.meta && !!props.meta.error) || props.error,
        errorText: (!!props.meta && !!props.meta.error && props.meta.error) || (props.error && props.errorText) || '',
    };
};

const mapDispatchToProps = dispatch => ({
    loadSuggestions: (searchKey, searchQuery = ' ') => dispatch(actions.loadSearchKeyList(searchKey, searchQuery)),
});

const AuthorIdAutoComplete = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AutoCompleteAsyncField);

export function AuthorIdField(fieldProps) {
    return <AuthorIdAutoComplete {...fieldProps} />;
}
