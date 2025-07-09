import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { default as locale } from 'locale/components';
import { dismissAppAlert, showAppAlert } from 'actions';

const getBulkDeleteMessages = messages => {
    const deleteMessages = [];

    for (const [userId, message] of Object.entries(messages)) {
        deleteMessages.push(
            <li key={`bulk-delete-user-${userId}`} data-testid={`bulk-delete-user-${userId}`}>
                <strong>{userId}</strong> - <span>{message}</span>
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
        userListLoadingError,
        userListItemUpdateSuccess,
        userListItemUpdateError,
        userListItemDeleteSuccess,
        userListItemDeleteError,
        userAddSuccess,
        userAddError,
        bulkUserDeleteMessages,
    } = useSelector(state => state.get('manageUsersReducer'));

    const {
        listUserErrorAlert,
        addUserSuccessAlert,
        addUserErrorAlert,
        deleteUserSuccessAlert,
        deleteUserErrorAlert,
        updateUserSuccessAlert,
        updateUserErrorAlert,
        bulkUserDeleteAlert,
    } = locale.components.manageUsers;

    React.useEffect(() => {
        /* istanbul ignore next */
        const alert =
            (!!userAddSuccess && addUserSuccessAlert) ||
            (!!userAddError && addUserErrorAlert) ||
            (!!userListItemDeleteSuccess && deleteUserSuccessAlert) ||
            (!!userListItemDeleteError && { ...deleteUserErrorAlert, message: userListItemDeleteError }) ||
            (!!userListItemUpdateSuccess && updateUserSuccessAlert) ||
            (!!userListItemUpdateError && updateUserErrorAlert) ||
            (!!userListLoadingError && listUserErrorAlert) ||
            (!!bulkUserDeleteMessages && {
                ...bulkUserDeleteAlert,
                message: getBulkDeleteMessages(bulkUserDeleteMessages),
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
        userListLoadingError,
        userListItemUpdateSuccess,
        userListItemUpdateError,
        userListItemDeleteSuccess,
        userListItemDeleteError,
        userAddSuccess,
        userAddError,
        bulkUserDeleteMessages,
    ]);

    return <div />;
};

export default React.memo(ActionFeedback);
