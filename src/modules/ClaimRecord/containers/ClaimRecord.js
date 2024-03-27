import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormSyncErrors, getFormValues, reduxForm, SubmissionError } from 'redux-form/immutable';
import Immutable from 'immutable';
import ClaimRecord from '../components/ClaimRecord';
import * as actions from 'actions';
import { withNavigate } from 'helpers/withNavigate';

const FORM_NAME = 'ClaimRecord';

const onSubmit = (values, dispatch) => {
    const data = { ...values.toJS() };
    return dispatch(actions.claimPublication(data)).catch(error => {
        throw new SubmissionError({ _error: error });
    });
};

let ClaimPublicationFormContainer = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    onSubmit,
})(ClaimRecord);

const mapStateToProps = state => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    const reducerOutput = (!!state && state.get('claimPublicationReducer')) || {};
    const contentIndicators =
        (reducerOutput.fullPublicationToClaim &&
            (reducerOutput.fullPublicationToClaim.fez_record_search_key_content_indicator || []).map(
                item => item.rek_content_indicator,
            )) ||
        [];
    return {
        fullPublicationToClaim: reducerOutput.fullPublicationToClaim || null,
        fullPublicationToClaimLoading: reducerOutput.fullPublicationToClaimLoading || false,
        fullPublicationToClaimLoadingFailed: reducerOutput.fullPublicationToClaimLoadingFailed || false,
        publicationToClaimFileUploadingError: reducerOutput.publicationToClaimFileUploadingError || null,
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        initialValues: {
            publication: reducerOutput.fullPublicationToClaim || reducerOutput.publicationToClaim || null,
            author: state && state.get('accountReducer') ? state.get('accountReducer').author : null,
            contentIndicators,
        },
        redirectPath: state && state.get('appReducer') ? state.get('appReducer').redirectPath : null,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

ClaimPublicationFormContainer = connect(mapStateToProps, mapDispatchToProps)(ClaimPublicationFormContainer);

export default withNavigate()(ClaimPublicationFormContainer);
