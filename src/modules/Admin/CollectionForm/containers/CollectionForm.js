import { connect } from 'react-redux';
import { reduxForm, getFormValues, SubmissionError, getFormSyncErrors } from 'redux-form/immutable';
import Immutable from 'immutable';
import CollectionForm from '../components/CollectionForm';
import { createCollection, checkSession, clearSessionExpiredFlag } from 'actions';
import { bindActionCreators } from 'redux';
import { getNotesSectionSearchKeys } from 'actions/transformers';

import queryString from 'query-string';

const FORM_NAME = 'Collection';

const onSubmit = (values, dispatch, props) => {
    const dataJS = { ...values.toJS() };
    const data = { ...dataJS, ...getNotesSectionSearchKeys(dataJS) };

    delete data.internalNotes; // transformed above to fez_internal_notes: {ain_detail}

    const currentAuthor = props.author || null;
    const queryStringObject = queryString.parse(
        location && ((location.hash && location.hash.replace('?', '&').replace('#', '?')) || location.search),
        { ignoreQueryPrefix: true },
    );

    let parentPID = {};

    if (!!queryStringObject.pid) {
        parentPID = {
            fez_record_search_key_ismemberof: queryStringObject.pid,
        };
    }
    // eslint-disable-next-line camelcase
    return dispatch(createCollection({ ...data, ...parentPID }, currentAuthor?.aut_id || null)).catch(error => {
        throw new SubmissionError({ _error: error });
    });
};

const CollectionContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(CollectionForm);

const mapStateToProps = state => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        author: (state && state.get('accountReducer') && state.get('accountReducer').author) || null,
        newRecord:
            (state && state.get('createCollectionReducer') && state.get('createCollectionReducer').newRecord) || null,
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ checkSession, clearSessionExpiredFlag }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionContainer);
