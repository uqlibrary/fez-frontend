/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AutoCompleteMultiSelectField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';

import PropTypes from 'prop-types';
import * as actions from 'actions';

export const CommunityField = props => {
    const dispatch = useDispatch();
    const loadSuggestions = () => dispatch(actions.communitiesList());
    const { itemsList, itemsLoading } = useSelector(state => state.get('communitiesReducer')) || {};

    const hasForm = props?.meta || props?.form;
    const defaultValue = hasForm
        ? (!!props.input.value && !!props.input.value.toJS && props.input.value.toJS()) ||
          (!!props.input.value && props.input.value) ||
          []
        : props.value || [];

    // remove existing entries from full list of communities
    const existingCommunityPids = defaultValue.map(community => community.rek_pid || community);
    const validCommunities = itemsList.filter(item => item.rek_object_type === 1);
    const missingCommunities = validCommunities.filter(item => existingCommunityPids.indexOf(item.rek_pid) === -1);

    return (
        <AutoCompleteMultiSelectField
            {...props}
            id={props.id}
            autoCompleteAsynchronousFieldId={'rek-ismemberof'}
            itemsList={missingCommunities || []}
            itemsLoading={itemsLoading}
            getOptionLabel={item => item.rek_title}
            {...(hasForm
                ? {
                      defaultValue,
                      error: !!props.meta.error,
                      errorText: props.meta.error || '',
                  }
                : {
                      defaultValue: itemsList.filter(community => defaultValue.includes(community.rek_pid)),
                      error: props.error,
                      errorText: props.errorText || '',
                  })}
            autoCompleteMultiSelectFieldId={props.communityFieldId}
            loadSuggestions={loadSuggestions}
            {...(hasForm
                ? {
                      onChange: item => props.input.onChange(item),
                      onClear: () => props.input.onChange(null),
                  }
                : {
                      onChange: item => props.onChange(item.map(community => community.rek_pid)),
                      onClear: () => props.onChange(null),
                  })}
        />
    );
};
CommunityField.propTypes = {
    props: PropTypes.object,
};
export default React.memo(CommunityField);
