import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { default as locale } from 'locale/components';
import { dismissAppAlert, showAppAlert } from 'actions';

const getBulkDeleteMessages = messages => {
    const deleteMessages = [];

    for (const [authorId, message] of Object.entries(messages)) {
        deleteMessages.push(
            <li key={`bulk-delete-author-${authorId}`} data-testid={`bulk-delete-author-${authorId}`}>
                <strong>{authorId}</strong> - <span>{message}</span>
            </li>,
        );
    }
    const message = (
        <span>
            <ul>{deleteMessages}</ul>
        </span>
    );
    return message;
};

export const ActionFeedback = () => {
    const dispatch = useDispatch();

    const {
        authorListLoadingError,
        authorListItemUpdateSuccess,
        authorListItemUpdateError,
        authorListItemDeleteSuccess,
        authorListItemDeleteError,
        authorAddSuccess,
        authorAddError,
        bulkAuthorDeleteMessages,
        scopusIngestRequesting,
        scopusIngestRequestSuccess,
        scopusIngestRequestError,
    } = useSelector(state => state.get('manageAuthorsReducer'));

    const {
        listAuthorErrorAlert,
        addAuthorSuccessAlert,
        addAuthorErrorAlert,
        deleteAuthorSuccessAlert,
        deleteAuthorErrorAlert,
        updateAuthorSuccessAlert,
        updateAuthorErrorAlert,
        bulkAuthorDeleteAlert,
        scopusIngestRequestingAlert,
        scopusIngestSuccessAlert,
        scopusIngestErrorAlert,
    } = locale.components.manageAuthors;

    React.useEffect(() => {
        const alert =
            (!!authorAddSuccess && addAuthorSuccessAlert) ||
            (!!authorAddError && addAuthorErrorAlert) ||
            (!!authorListItemDeleteSuccess && deleteAuthorSuccessAlert) ||
            (!!authorListItemDeleteError && { ...deleteAuthorErrorAlert, message: authorListItemDeleteError }) ||
            (!!authorListItemUpdateSuccess && updateAuthorSuccessAlert) ||
            (!!authorListItemUpdateError && updateAuthorErrorAlert) ||
            (!!authorListLoadingError && listAuthorErrorAlert) ||
            (!!bulkAuthorDeleteMessages && {
                ...bulkAuthorDeleteAlert,
                message: getBulkDeleteMessages(bulkAuthorDeleteMessages),
            }) ||
            (!!scopusIngestRequesting && scopusIngestRequestingAlert) ||
            (!!scopusIngestRequestSuccess && scopusIngestSuccessAlert) ||
            (!!scopusIngestRequestError && {
                ...scopusIngestErrorAlert,
                message: scopusIngestRequestError,
            }) ||
            null;

        !!alert &&
            dispatch(
                showAppAlert({
                    ...alert,
                    dismissAction: /* c8 ignore next */ () => dispatch(dismissAppAlert()),
                }),
            );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        authorListLoadingError,
        authorListItemUpdateSuccess,
        authorListItemUpdateError,
        authorListItemDeleteSuccess,
        authorListItemDeleteError,
        authorAddSuccess,
        authorAddError,
        bulkAuthorDeleteMessages,
        scopusIngestRequesting,
        scopusIngestRequestSuccess,
        scopusIngestRequestError,
    ]);

    return <div />;
};

export default React.memo(ActionFeedback);
