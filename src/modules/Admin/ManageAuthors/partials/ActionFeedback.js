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
    } = useSelector(state => state.get('manageAuthorsReducer'));

    const {
        listAuthorErrorAlert,
        addAuthorErrorAlert,
        addAuthorSuccessAlert,
        deleteAuthorErrorAlert,
        deleteAuthorSuccessAlert,
        updateAuthorErrorAlert,
        updateAuthorSuccessAlert,
        bulkAuthorDeleteAlert,
    } = locale.components.manageAuthors;

    React.useEffect(() => {
        const alert =
            (!!authorAddSuccess && addAuthorSuccessAlert) ||
            (!!authorAddError && addAuthorErrorAlert) ||
            (!!authorListItemDeleteSuccess && deleteAuthorSuccessAlert) ||
            (!!authorListItemDeleteError && deleteAuthorErrorAlert) ||
            (!!authorListItemUpdateSuccess && updateAuthorSuccessAlert) ||
            (!!authorListItemUpdateError && updateAuthorErrorAlert) ||
            (!!authorListLoadingError && listAuthorErrorAlert) ||
            (!!bulkAuthorDeleteMessages && {
                ...bulkAuthorDeleteAlert,
                message: getBulkDeleteMessages(bulkAuthorDeleteMessages),
            });
        null;

        !!alert &&
            dispatch(
                showAppAlert({
                    ...alert,
                    dismissAction: /* istanbul ignore next */ () => dispatch(dismissAppAlert()),
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
    ]);

    return <div />;
};

export default React.memo(ActionFeedback);
