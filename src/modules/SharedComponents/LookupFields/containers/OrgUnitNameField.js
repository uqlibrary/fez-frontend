/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';

import * as actions from 'actions';

const category = 'org_unit_name';

export const OrgUnitNameField = props => {
    const dispatch = useDispatch();
    const loadSuggestions = (searchQuery = ' ') => dispatch(actions.loadSearchKeyList(category, searchQuery));

    const { itemsList, itemsLoading } = useSelector(
        state => state.get('searchKeysReducer') && state.get('searchKeysReducer')[category],
    ) || { itemsList: [], itemsLoading: false };

    return (
        <AutoCompleteAsynchronousField
            {...props}
            autoCompleteAsynchronousFieldId={props.orgUnitNameFieldId || 'rek-org-unit-name'}
            category={category}
            itemsList={itemsList}
            itemsLoading={itemsLoading}
            allowFreeText
            getOptionLabel={item => (!!item && String(item.value)) || ''}
            filterOptions={options => options}
            // If props.meta is set then it's a redux-form Field
            {...(props.meta
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

OrgUnitNameField.propTypes = {
    props: PropTypes.object,
};
export default React.memo(OrgUnitNameField);
