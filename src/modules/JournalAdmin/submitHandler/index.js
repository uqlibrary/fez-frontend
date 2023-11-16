import { SubmissionError } from 'redux-form/immutable';
import { adminJournalUpdate } from 'actions';
import { detailedDiff } from 'deep-object-diff';

export const onSubmit = (values, dispatch, { initialValues }) => {
    const data = (values && values.toJS()) || null;

    let jnlValues = {};

    const initialData = (initialValues && initialValues.toJS()) || null;
    const changes = detailedDiff(initialData, data);
    jnlValues = { ...changes };

    let requestObject = {
        ...jnlValues,
        id: data.journal.rek_pid,
    };

    requestObject = data;

    return dispatch(adminJournalUpdate({ ...requestObject })).catch(error => {
        throw new SubmissionError({ _error: error });
    });
};
