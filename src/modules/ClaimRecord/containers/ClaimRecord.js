import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm, getFormValues, stopSubmit, SubmissionError} from 'redux-form/immutable';
import Immutable from 'immutable';
import ClaimRecord from '../components/ClaimRecord';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';
import {confirmDiscardFormChanges} from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import {default as formLocale} from 'locale/forms';


const FORM_NAME = 'ClaimRecord';

const onSubmit = (values, dispatch) => {
    const data = {...values.toJS()};
    return dispatch(actions.claimPublication(data))
        .then(() => {
            // once this promise is resolved form is submitted successfully and will call parent container
            // reported bug to redux-form:
            // reset form after success action was dispatched:
            // componentWillUnmount cleans up form, but then onSubmit success sets it back to active
            // setTimeout(()=>{
            //     dispatch(reset(FORM_NAME));
            // }, 100);
        }).catch(error => {
            throw new SubmissionError({_error: error.message});
        });
};

const validate = (values) => {
    // reset global errors, eg form submit failure
    stopSubmit(FORM_NAME, null);

    const data = values.toJS();
    const errors = [];
    const txt = formLocale.forms.claimPublicationForm;

    // If author/editor linker is shown
    if(data.publication && (data.publication.fez_record_search_key_author_id.length > 1 || data.publication.fez_record_search_key_contributor_id.length > 1)) {
        // If !linking when there are more than a 1 author on the publication or more than 1 contributor (and no authors) listed on the publication
        if ((!data.authorLinking &&  data.publication && data.publication.fez_record_search_key_author_id.length > 1) ||
            (!data.contributorLinking &&  data.publication && data.publication.fez_record_search_key_contributor_id.length > 1 && data.publication.fez_record_search_key_author_id.length === 0)) {
            errors.push(txt.errorSelect);
        }
        // If neither author or contributor are selected (show all the time), or if one is and they are invalid
        if((!data.authorLinking && !data.contributorLinking) ||
            (data.authorLinking && !data.authorLinking.valid) ||
            (data.contributorLinking && !data.contributorLinking.valid)) {
            errors.push(txt.errorValid);
        }
    }
    return errors.length > 0 ? {_error: errors} : null;
};

let ClaimPublicationFormContainer = reduxForm({
    form: FORM_NAME,
    validate,
    onSubmit
})(confirmDiscardFormChanges(ClaimRecord, FORM_NAME));

const mapStateToProps = (state) => {
    return {
        publicationToClaimFileUploadingError: state && state.get('claimPublicationReducer') ? state.get('claimPublicationReducer').publicationToClaimFileUploadingError : null,
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        initialValues: {
            publication: state && state.get('claimPublicationReducer') ? state.get('claimPublicationReducer').publicationToClaim : null,
            author: state && state.get('accountReducer') ? state.get('accountReducer').author : null
        }
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

ClaimPublicationFormContainer = connect(mapStateToProps, mapDispatchToProps)(ClaimPublicationFormContainer);
ClaimPublicationFormContainer = withRouter(ClaimPublicationFormContainer);

export default ClaimPublicationFormContainer;
