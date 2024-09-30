/* eslint-disable no-unused-vars */
import { adminJournalUpdate } from 'actions';
import { detailedDiff } from 'deep-object-diff';
import { SERVER_ERROR_KEY } from 'config/general';

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
    delete requestObject.doajSection;
    delete requestObject.indexedSection;
    delete requestObject.uqDataSection;

    return dispatch(adminJournalUpdate({ ...requestObject }))
        .then(() => Promise.resolve())
        .catch(error => {
            console.log(error);
            methods.setError(SERVER_ERROR_KEY, { type: 'custom', message: error.message });
        });
};
