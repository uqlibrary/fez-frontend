/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';

import * as actions from 'actions';

const category = 'publisher';

export const PublisherField = props => {
    const dispatch = useDispatch();
    const loadSuggestions = (searchQuery = ' ') => dispatch(actions.loadSearchKeyList(category, searchQuery));

    const { itemsList, itemsLoading } = useSelector(
        state => state.get('searchKeysReducer') && state.get('searchKeysReducer')[category],
    ) || { itemsList: [], itemsLoading: false };

    return (
        <AutoCompleteAsynchronousField
            {...props}
            autoCompleteAsynchronousFieldId={props.publisherFieldId || 'rek-publisher'}
            category={category}
            placeholder={props.placeholder || null}
            itemsList={itemsList}
            itemsLoading={itemsLoading}
            allowFreeText
            getOptionLabel={item => (!!item && String(item.value)) || ''}
            filterOptions={options => options}
            // If form key is set in props.meta object then it's a redux-form Field
            {...(!!((props || {}).meta || {}).form
                ? {
                      defaultValue: (!!props.input.value && { value: props.input.value }) || null,
                      error: !!props.meta.error,
                      errorText: props.meta.error || '',
                      onChange: item => props.input.onChange(item.value),
                      onClear: () => props.input.onChange(null),
                  }
                : {
                      defaultValue: (!!props.value && { value: props.value }) || '',
                      error: props.error,
                      errorText: props.errorText || '',
                      onChange: item => props.onChange(item),
                      onClear: () => props.onChange({ value: null }),
                  })}
            loadSuggestions={loadSuggestions}
        />
    );
};

PublisherField.propTypes = {
    props: PropTypes.object,
};
export default React.memo(PublisherField);
