import { connect } from 'react-redux';
import { reduxForm, getFormValues, SubmissionError, getFormSyncErrors } from 'redux-form/immutable';
import Immutable from 'immutable';
import CollectionForm from '../components/CollectionForm';
import { createCollection, checkSession, clearSessionExpiredFlag } from 'actions';
import { bindActionCreators } from 'redux';

import queryString from 'query-string';

const queryStringObject = queryString.parse(
    location && ((location.hash && location.hash.replace('?', '&').replace('#', '?')) || location.search),
    { ignoreQueryPrefix: true },
);
const FORM_NAME = 'Collection';

const onSubmit = (values, dispatch, props) => {
    const currentAuthor = props.author || null;
    let parentPID = {};

    if (!!queryStringObject.pid) {
        parentPID = {
            fez_record_search_key_ismemberof: queryStringObject.pid,
        };
    }
    return dispatch(
        createCollection({ ...values.toJS(), ...parentPID }, (currentAuthor && currentAuthor.aut_id) || null),
    ).catch(error => {
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
