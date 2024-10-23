import { adminJournalUpdate } from 'actions';
import { SERVER_ERROR_KEY } from 'config/general';

export const onSubmit = (values, dispatch, { methods }) => {
    const requestObject = {
        adminSection: { ...values.adminSection },
        bibliographicSection: { ...values.bibliographicSection },
        jnl_jid: values.journal.jnl_jid,
        journal: { ...values.journal },
    };

    return dispatch(adminJournalUpdate({ ...requestObject }))
        .then(() => Promise.resolve())
        .catch(error => {
            console.log(error);
            methods.setError(SERVER_ERROR_KEY, { type: 'server', message: error.message });
        });
};
