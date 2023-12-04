/* eslint-disable no-unused-vars */
import { SubmissionError } from 'redux-form/immutable';
import { adminJournalUpdate } from 'actions';
import { detailedDiff } from 'deep-object-diff';

export const onSubmit = (values, dispatch, { initialValues }) => {
    const data = (values && values.toJS()) || null;
    let jnlValues = {};

    const initialData = (initialValues && initialValues.toJS()) || null;
    const changes = detailedDiff(initialData, data);
    jnlValues = { ...changes.updated };

    const requestObject = {
        ...data,
        ...jnlValues,
        jnl_jid: data.journal.jnl_jid,
    };

    return dispatch(adminJournalUpdate({ ...requestObject }))
        .then(() => Promise.resolve())
        .catch(error => {
            throw new SubmissionError({ _error: error });
        });
};
