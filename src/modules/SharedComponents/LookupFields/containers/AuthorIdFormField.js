import React from 'react';
import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';
import matchSorter from 'match-sorter';

const mapStateToProps = (state, props) => {
    return {
        id: props.id,
        itemsList:
            state.get('searchKeysReducer') && state.get('searchKeysReducer').author
                ? state.get('searchKeysReducer').author.itemsList.filter(item => !!item.id && item.id !== 0)
                : [],
        onChange: item => {
            if (!!item && !item.id && !!props.input) {
                props.input.onChange(null);
            } else if ((!!item && !item.id) || isNaN(parseInt(item.id, 10))) {
                props.input.onChange({
                    ...item,
                    id: isNaN(parseInt(item.value, 10)) ? undefined : `${parseInt(item.value, 10)}`,
                });
            } else {
                props.input.onChange(item);
            }
        },
        onClear: () => props.input.onChange(null),
        defaultValue:
            (!!props.input &&
                !!props.input.value &&
                (props.input.value.toJS ? props.input.value.toJS() : props.input.value)) ||
            null,
        getOptionLabel: item => (!!item && String(`${item.id} (${item.value})`)) || '',
        filterOptions: (options, { inputValue }) => matchSorter(options, inputValue, { keys: ['id', 'value'] }),
        error: (!!props.meta && !!props.meta.error) || props.error,
        errorText: (!!props.meta && !!props.meta.error && props.meta.error) || (props.error && props.errorText) || '',
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
