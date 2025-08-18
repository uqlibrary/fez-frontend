/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';

import * as actions from 'actions';

const category = 'org_name';

export const OrgNameField = props => {
    const dispatch = useDispatch();
    const loadSuggestions = (searchQuery = ' ') => dispatch(actions.loadSearchKeyList(category, searchQuery));

    const { itemsList, itemsLoading } = useSelector(
        state => state.get('searchKeysReducer') && state.get('searchKeysReducer')[category],
    ) || { itemsList: [], itemsLoading: false };

    return (
        <AutoCompleteAsynchronousField
            {...props}
            autoCompleteAsynchronousFieldId={props.orgNameFieldId || 'rek-org-name'}
            category={category}
            itemsList={itemsList}
            itemsLoading={itemsLoading}
            allowFreeText
            getOptionLabel={item => (!!item && String(item.value)) || ''}
            filterOptions={options => options}
            defaultValue={(!!props.value && { value: props.value }) || null}
            onChange={item => props.onChange(item.value)}
            onClear={() => props.onChange(null)}
            loadSuggestions={loadSuggestions}
        />
    );
};

OrgNameField.propTypes = {
    props: PropTypes.object,
};
export default React.memo(OrgNameField);
