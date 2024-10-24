import { adminJournalUpdate } from 'actions';

export const onSubmit = (values, dispatch, { server }) => {
    const requestObject = {
        adminSection: { ...values.adminSection },
        bibliographicSection: { ...values.bibliographicSection },
        jnl_jid: values.journal.jnl_jid,
        journal: { ...values.journal },
    };

    return dispatch(adminJournalUpdate({ ...requestObject }))
        .then(() => Promise.resolve())
        .catch(e => {
            console.log(e);
            server.error.set(e);
        });
};
