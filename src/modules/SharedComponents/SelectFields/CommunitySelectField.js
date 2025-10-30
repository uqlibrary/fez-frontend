import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import * as actions from 'actions';
import { createSelector } from 'reselect';

export default function CommunitySelectField(fieldProps) {
    const dispatch = useDispatch();
    const noHtmlConfig = { ALLOWED_TAGS: [''] };
    const dompurify = require('dompurify');

    // Selector to fetch the itemsList from the state
    // c8 ignore next
    const getItemsList = state => state?.get('communitiesReducer')?.itemsList || [];

    // Memoized selector to transform the itemsList
    const getTranslatedItemList = createSelector([getItemsList], itemsList =>
        itemsList.map((item, index) => {
            return {
                text: dompurify.sanitize(item.rek_title, noHtmlConfig),
                value: item.rek_pid,
                index: index + 1,
            };
        }),
    );
    // Use the memoized selector
    const translatedItemList = useSelector(getTranslatedItemList);
    const itemsLoading = useSelector(
        state => !!state.get('communitiesReducer') && state.get('communitiesReducer').itemsLoading,
    );

    React.useEffect(() => {
        dispatch(actions.communitiesList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <NewGenericSelectField
            disabled={itemsLoading || fieldProps.disabled}
            displayEmpty={itemsLoading} // display loading prompt while items are loading
            itemsList={translatedItemList}
            itemsLoading={itemsLoading}
            value={fieldProps.value || ''}
            {...fieldProps}
        />
    );
}
