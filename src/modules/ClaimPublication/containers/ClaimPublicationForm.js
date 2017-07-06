import {connect} from 'react-redux';
import {reduxForm, getFormValues} from 'redux-form/immutable';
import ClaimPublicationForm from '../components/ClaimPublicationForm';
import {claimPublication, claimPublicationReset} from '../actions';
import Immutable from 'immutable';

let ClaimPublicationFormContainer = reduxForm({
    form: 'ClaimPublicationForm'
})(ClaimPublicationForm);

ClaimPublicationFormContainer = connect((state) => {
    const claimPublication = state.get('claimPublication');
    const authorLinking = state.get('authorLinking');
    const fileUploadState = state.get('fileUpload');
    return {
        acceptedFiles: fileUploadState.get('acceptedFiles'),
        claimPublicationResults: claimPublication.get('claimPublicationResults'),
        formValues: getFormValues('ClaimPublicationForm')(state) || Immutable.Map({}),
        isUploadCompleted: fileUploadState.get('isUploadCompleted'),
        recordClaimState: claimPublication.get('recordClaimState'),
        recordClaimErrorMessage: claimPublication.get('recordClaimErrorMessage'),
        selectedPublication: claimPublication.get('selectedPublication'),
        selectedAuthorId: authorLinking.get('selectedAuthor')
    };
}, dispatch => {
    return {
        claimPublication: (data) => dispatch(claimPublication(data)),
        claimPublicationReset: () => dispatch(claimPublicationReset())
    };
})(ClaimPublicationFormContainer);

export default ClaimPublicationFormContainer;
