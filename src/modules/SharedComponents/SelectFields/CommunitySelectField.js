import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import * as actions from 'actions';

export default function CommunitySelectField(fieldProps) {
    const dispatch = useDispatch();
    const noHtmlConfig = { ALLOWED_TAGS: [''] };
    const dompurify = require('dompurify');
    const translatedItemList = useSelector(
        state =>
            !!state.get('communitiesReducer') &&
            state.get('communitiesReducer').itemsList.map((item, index) => {
                return {
                    text: dompurify.sanitize(item.rek_title, noHtmlConfig),
                    value: item.rek_pid,
                    index: index + 1,
                };
            }),
    );
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
            error={!!fieldProps.meta?.error}
            errorText={fieldProps.meta?.error}
            itemsList={translatedItemList}
            itemsLoading={itemsLoading}
            onChange={fieldProps.input?.onChange}
            value={fieldProps.input?.value || ''}
            {...fieldProps}
        />
    );
}
