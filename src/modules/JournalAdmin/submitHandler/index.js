import { adminJournalUpdate } from 'actions';

export const onSubmit = (values, dispatch, { setServerError }) => {
    const requestObject = {
        adminSection: { ...values.adminSection },
        bibliographicSection: { ...values.bibliographicSection },
        readAndPublishSection: { ...values.readAndPublishSection },
        jnl_jid: values.journal.jnl_jid,
        journal: { ...values.journal },
    };

    return dispatch(adminJournalUpdate({ ...requestObject }))
        .then(() => Promise.resolve())
        .catch(e => {
            console.log(e);
            setServerError(e);
        });
};
