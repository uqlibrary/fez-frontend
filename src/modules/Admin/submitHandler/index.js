import { adminUpdate, adminCreate, updateCollection, updateCommunity } from 'actions';
import { detailedDiff } from 'deep-object-diff';

export const onSubmit = (values, dispatch, { setServerError, initialValues, params }) => {
    const data = (values && (values.toJS?.() || values)) || null; // TODO, remove toJS
    const recType = (!!data.publication && data.publication.rek_object_type_lookup) || '';
    const isEdit = !!data.publication && !!data.publication.rek_pid && data.publication.rek_pid === params.pid;

    let action = null;
    let recValues = {};

    // Collections and Communities send data to the API via PUT, so
    // unlike other record types we want to send all of the record across
    if (recType === 'Collection' || recType === 'Community') {
        recValues = { ...data };
    } else {
        const initialData = (initialValues && (initialValues.toJS?.() || initialValues)) || null; // TODO, remove toJS
        const changes = detailedDiff(initialData, data);
        recValues = { ...changes };
    }

    let requestObject = isEdit
        ? {
              ...recValues,
              // This is ignored for regular records.
              pid: data.publication.rek_pid,
              // The fallback to rek_created_date for rek_date may only be used for
              // collections and communities. Legacy omits rek_date when creating
              // them, but it's required by API.
              date: data.publication.rek_date || data.publication.rek_created_date,
          }
        : data;

    switch (recType) {
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

    return dispatch(action({ ...requestObject }))
        .then(() => Promise.resolve())
        .catch(e => {
            console.log(e);
            setServerError(e);
        });
};
