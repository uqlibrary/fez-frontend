/* eslint-disable no-unused-vars */
import { SubmissionError } from 'redux-form/immutable';
import { adminJournalUpdate } from 'actions';
import { detailedDiff } from 'deep-object-diff';

export const onSubmit = (values, dispatch, { initialValues }) => {
    const data = (values && values.toJS()) || null;
    let jnlValues = {};

    const initialData = (initialValues && initialValues.toJS()) || null;
    const changes = detailedDiff(initialData, data);
    jnlValues = { ...changes };

    const requestObject = {
        ...jnlValues,
        jnl_jid: data.journal.jnl_jid,
    };
    return dispatch(adminJournalUpdate({ ...requestObject })).catch(error => {
        console.error(error);
        throw new SubmissionError({ _error: error });
    });
};
