/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { AutoCompleteMultiSelectField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';

import * as actions from 'actions';

export const CollectionField = props => {
    const dispatch = useDispatch();
    const { itemsList, itemsLoading } = useSelector(state => state.get('collectionsReducer')) || {};
    const loadSuggestions = () => dispatch(actions.collectionsList());
    const hasForm = props?.meta || props?.form;

    const defaultValue = hasForm
        ? (!!props.input.value && !!props.input.value.toJS && props.input.value.toJS()) ||
          (!!props.input.value && props.input.value) ||
          []
        : props.value || [];

    // remove existing entries from full list of collections
    const existingCollectionPids = defaultValue.map(collection => collection.rek_pid || collection);
    const missingCollections = itemsList.filter(item => existingCollectionPids.indexOf(item.rek_pid) === -1);

    return (
        <AutoCompleteMultiSelectField
            {...props}
            id={props.id}
            autoCompleteAsynchronousFieldId={'rek-ismemberof'}
            itemsList={missingCollections || []}
            itemsLoading={itemsLoading}
            getOptionLabel={item => item.rek_title}
            {...(hasForm
                ? {
                      defaultValue: defaultValue,
                      error: props?.meta?.error,
                      errorText: props?.meta?.error || '',
                  }
                : {
                      defaultValue: itemsList.filter(collection => defaultValue.includes(collection.rek_pid)),
                      error: props.error,
                      errorText: props.errorText || '',
                  })}
            autoCompleteMultiSelectFieldId={props.collectionFieldId}
            loadSuggestions={loadSuggestions}
            {...(hasForm
                ? {
                      onChange: item => props.input.onChange(item),
                      onClear: () => props.input.onChange(null),
                  }
                : {
                      onChange: item => props.onChange(item.map(collection => collection.rek_pid)),
                      onClear: () => props.onChange(null),
                  })}
        />
    );
};
CollectionField.propTypes = {
    props: PropTypes.object,
};
export default React.memo(CollectionField);
