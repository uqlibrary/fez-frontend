/* eslint-disable no-unused-vars */
import { adminJournalUpdate } from 'actions';
import { detailedDiff } from 'deep-object-diff';

export const onSubmit = (values, dispatch, { initialValues, methods }) => {
    console.log(values, initialValues);
    const data = values || null;
    let jnlValues = {};

    const initialData = initialValues || null;
    const changes = detailedDiff(initialData, data);
    jnlValues = { ...changes.updated };

    const requestObject = {
        ...data,
        ...jnlValues,
        jnl_jid: data.journal.jnl_jid,
    };
    console.log(requestObject, jnlValues);
    return dispatch(adminJournalUpdate({ ...requestObject }))
        .then(() => Promise.resolve())
        .catch(error => {
            console.log(error);
            methods.setError('root.server', { type: 'server', message: error.message });
        });
};
