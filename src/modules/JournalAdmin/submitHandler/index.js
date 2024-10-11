import { adminJournalUpdate } from 'actions';
import { detailedDiff } from 'deep-object-diff';
import { SERVER_ERROR_KEY } from 'config/general';

export const onSubmit = (values, dispatch, { initialValues, methods }) => {
    const data = values || null;

    const initialData = initialValues || null;

    const changes = detailedDiff(initialData, data);

    const requestObject = {
        adminSection: { ...data.adminSection },
        bibliographicSection: { ...data.bibliographicSection },
        ...changes,
        jnl_jid: data.journal.jnl_jid,
    };

    return dispatch(adminJournalUpdate({ ...requestObject }))
        .then(() => Promise.resolve())
        .catch(error => {
            console.log(error);
            methods.setError(SERVER_ERROR_KEY, { type: 'server', message: error.message });
        });
};
