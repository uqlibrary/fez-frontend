import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import ClaimPublicationForm from '../components/ClaimPublicationForm';


let ClaimPublicationFormContainer = reduxForm({
    form: 'ClaimPublicationForm'
})(ClaimPublicationForm);

ClaimPublicationFormContainer = connect((state) => {
    const claimPublication = state.get('claimPublication');
    const fileUploadState = state.get('fileUpload');
    return {
        acceptedFiles: fileUploadState.get('acceptedFiles'),
        claimPublicationResults: claimPublication.get('claimPublicationResults'),
        isUploadCompleted: fileUploadState.get('isUploadCompleted'),
        recordClaimState: claimPublication.get('recordClaimState'),
        recordClaimErrorMessage: claimPublication.get('recordClaimErrorMessage'),
        selectedPublication: claimPublication.get('selectedPublication')
    };
})(ClaimPublicationFormContainer);

export default ClaimPublicationFormContainer;
