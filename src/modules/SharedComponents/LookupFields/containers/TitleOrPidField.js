import React from 'react';
import { AutoCompleteAsyncField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';

const mapStateToProps = (state, props) => {
    const category = 'publication';
    return {
        category: category,
        itemsList:
            state.get('searchKeysReducer') && state.get('searchKeysReducer')[category]
                ? state
                    .get('searchKeysReducer')
                    [category].itemsList.map(publication => ({
                        id: publication.rek_pid,
                        value: publication.rek_title,
                        publication: publication,
                    }))
                : [],
        onChange: item => props.input.onChange(item),
        async: true,
        errorText: props.meta ? props.meta.error : null,
        error: !!props.meta && !!props.meta.error,
        itemToString: item => (!!item && String(item.value)) || '',
        selectedValue: (!!props.input && !!props.input.value && { value: props.input.value }) || null,
        maxResults: 20,
        MenuItemComponent: item => (
            <PublicationCitation publication={item.suggestion.publication} hideCitationCounts hideLinks />
        ),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadSuggestions: (searchKey, searchQuery = ' ') =>
            dispatch(actions.loadPublicationList(searchKey, searchQuery)),
    };
};

export const TitleOrPidField = connect(
    mapStateToProps,
    mapDispatchToProps
)(AutoCompleteAsyncField);
