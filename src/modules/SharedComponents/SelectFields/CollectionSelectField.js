import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { TOP_LEVEL_SECURITY_POLICIES } from 'config/general';
import * as actions from 'actions';

export const CollectionSelectField = fieldProps => {
    const { communityId } = fieldProps;
    const dispatch = useDispatch();
    const itemsList = useSelector(state =>
        state.get('collectionsReducer').itemsList.map(item => {
            const securityPolicy = TOP_LEVEL_SECURITY_POLICIES.find(policy => policy.id === item.rek_security_policy);
            return { text: `${item.rek_title} (${securityPolicy.label})`, value: item.rek_pid, index: item.rek_pid };
        }),
    );
    const itemsLoading = useSelector(state => state.get('collectionsReducer').itemsLoading);

    React.useEffect(() => {
        !!communityId && dispatch(actions.collectionsList(communityId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [communityId]);

    return (
        <NewGenericSelectField
            disabled={itemsLoading || fieldProps.disabled}
            displayEmpty={itemsLoading} // display loading prompt while items are loading
            itemsList={itemsList}
            itemsLoading={itemsLoading}
            value={fieldProps.value || ''}
            {...fieldProps}
        />
    );
};

CollectionSelectField.displayName = 'CollectionSelectField';
export default CollectionSelectField;
