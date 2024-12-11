/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import * as actions from 'actions';
import Fuse from 'fuse.js';
import { GenericOptionTemplate } from 'modules/SharedComponents/LookupFields';

export const AuthorIdField = props => {
    const dispatch = useDispatch();
    const loadSuggestions = (searchQuery = ' ') => dispatch(actions.loadSearchKeyList('author', searchQuery));

    const { itemsList, itemsLoading } = useSelector(
        state => state.get('searchKeysReducer') && state.get('searchKeysReducer').author,
    ) || {
        itemsList: [],
        itemsLoading: false,
    };

    const fuseOptions = {
        useExtendedSearch: true,
        ignoreLocation: false,
        ignoreFieldNorm: false,
        keys: ['id', 'value', 'aut_orcid_id'],
    };

    return (
        <AutoCompleteAsynchronousField
            {...props}
            id={props.id}
            autoCompleteAsynchronousFieldId={props.authorIdFieldId}
            itemsList={itemsList.filter(item => !!item.id && item.id !== 0)}
            itemsLoading={itemsLoading}
            hideLabel={props.hideLabel || false}
            placeholder={props.placeholder || null}
            getOptionLabel={item => (!!item && !!item.id && String(`${item.id} (${item.value})`)) || ''}
            filterOptions={(options, { inputValue }) => {
                const fuseAutocompleteOptions = new Fuse(options, fuseOptions);
                return fuseAutocompleteOptions.search(inputValue).map(item => item.item);
            }}
            OptionTemplate={GenericOptionTemplate}
            loadSuggestions={loadSuggestions}
            error={!!props.meta.error}
            errorText={props.meta.error}
        />
    );
};

AuthorIdField.propTypes = {
    props: PropTypes.object,
};
export default React.memo(AuthorIdField);
