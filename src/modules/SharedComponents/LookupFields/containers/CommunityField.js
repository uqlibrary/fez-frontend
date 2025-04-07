/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { AutoCompleteMultiSelectField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';

import * as actions from 'actions';

export const CommunityField = props => {
    const dispatch = useDispatch();
    const { itemsList, itemsLoading } = useSelector(state => state.get('communitiesReducer')) || {};

    const loadSuggestions = () => dispatch(actions.communitiesList());
    const defaultValue = props.value || [];

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
            defaultValue={defaultValue}
            error={props?.meta?.error}
            errorText={props?.meta?.error || ''}
            autoCompleteMultiSelectFieldId={props.communityFieldId}
            loadSuggestions={loadSuggestions}
            onChange={item => props.input.onChange(item)}
            onClear={() => props.input.onChange(null)}
        />
    );
};
CommunityField.propTypes = {
    props: PropTypes.object,
};
export default React.memo(CommunityField);
