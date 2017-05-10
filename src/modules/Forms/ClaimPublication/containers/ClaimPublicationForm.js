import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import ClaimPublicationForm from '../components/ClaimPublicationForm';
import {loadPublicationSubTypesList, loadAuthorsList} from '../actions';
import Immutable from 'immutable';


let ClaimPublicationFormContainer = reduxForm({
    form: 'ClaimPublicationForm'
})(ClaimPublicationForm);

ClaimPublicationFormContainer = connect(state => {
    const publicationTypeState = state.get('publicationSubTypes');
    return {
        authorList: publicationTypeState.get('authorList') || Immutable.Map({}),
        publicationSubTypeList: publicationTypeState.get('publicationSubTypeList')
    };
}, dispatch => {
    return {
        loadPublicationSubTypesList: () => dispatch(loadPublicationSubTypesList()),
        loadAuthorsList: () => dispatch(loadAuthorsList())
    };
})(ClaimPublicationFormContainer);

export default ClaimPublicationFormContainer;
