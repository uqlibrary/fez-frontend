import React from 'react';
import { AutoCompleteMultiSelectField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const { itemsList } = state.get('collectionsReducer') || {};
    return {
        id: props.id,
        itemsList: itemsList || [],
        onChange: item => props.input.onChange(item),
        onClear: () => props.input.onChange(null),
        getOptionLabel: item => item.rek_title,
        error: !!props.meta && !!props.meta.error,
        errorText: (!!props.meta && !!props.meta.error && props.meta.error) || '',
    };
};

const mapDispatchToProps = dispatch => ({
    loadSuggestions: () => dispatch(actions.collectionsList()),
});

const CollectionAutoComplete = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AutoCompleteMultiSelectField);

export function CollectionFormField(fieldProps) {
    return <CollectionAutoComplete {...fieldProps} />;
}
