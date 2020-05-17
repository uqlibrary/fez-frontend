import { SubmissionError } from 'redux-form/immutable';
import { adminUpdate, adminCreate, updateCollection, updateCommunity } from 'actions';
import { detailedDiff } from 'deep-object-diff';

export const onSubmit = (values, dispatch, { initialValues, match }) => {
    const data = (values && values.toJS()) || null;
    const initialData = (initialValues && initialValues.toJS()) || null;
    const changes = detailedDiff(initialData, data);

    const isEdit = !!data.publication && !!data.publication.rek_pid && data.publication.rek_pid === match.params.pid;

    let action = null;
    let requestObject = isEdit
        ? {
            ...changes,
            // This is ignored for regular records.
            pid: data.publication.rek_pid,
            // The fallback to rek_created_date for rek_date may only be used for
            // collections and communities. Legacy omits rek_date when creating
            // them, but it's required by API.
            date: data.publication.rek_date || data.publication.rek_created_date,
        }
        : data;
    switch ((!!data.publication && data.publication.rek_object_type_lookup) || '') {
        case 'Collection':
            action = isEdit ? updateCollection : null;
            break;
        case 'Community':
            action = isEdit ? updateCommunity : null;
            break;
        default:
            requestObject = data;
            action = isEdit ? adminUpdate : adminCreate;
            break;
    }

    return dispatch(action(requestObject)).catch(error => {
        throw new SubmissionError({ _error: error });
    });
};
