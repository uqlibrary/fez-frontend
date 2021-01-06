import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import BulkUpdatesList from './BulkUpdatesList';

import locale from 'locale/pages';
import { loadBulkUpdatesList } from 'actions';

export const BulkUpdates = () => {
    const dispatch = useDispatch();

    const bulkUpdatesListLoading = useSelector(state => state.get('bulkUpdatesReducer').bulkUpdatesListLoading);
    const bulkUpdatesList = useSelector(state => state.get('bulkUpdatesReducer').bulkUpdatesList);
    const bulkUpdatesListError = useSelector(state => state.get('bulkUpdatesReducer').bulkUpdatesListError);

    React.useEffect(() => {
        if (!bulkUpdatesList) {
            dispatch(loadBulkUpdatesList());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (bulkUpdatesListLoading) {
        return (
            <StandardPage>
                <InlineLoader message={locale.pages.bulkUpdates.loadingMessage} />
            </StandardPage>
        );
    }

    if (bulkUpdatesListError) {
        return (
            <StandardPage>
                <Alert {...bulkUpdatesListError} type="error" />
            </StandardPage>
        );
    }

    return (
        <StandardPage title={locale.pages.bulkUpdates.title}>
            {!!bulkUpdatesList && <BulkUpdatesList list={bulkUpdatesList} />}
        </StandardPage>
    );
};

export default React.memo(BulkUpdates);
