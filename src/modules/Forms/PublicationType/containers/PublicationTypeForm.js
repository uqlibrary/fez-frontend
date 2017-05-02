import {connect} from 'react-redux';
import {reduxForm} from 'redux-form/immutable';

import PublicationTypeForm from '../components/PublicationTypeForm';
import {loadPublicationTypesList, loadSelectedPublicationType} from '../actions';


let PublicationTypeFormContainer = reduxForm({
    form: 'PublicationTypeForm'
})(PublicationTypeForm);

PublicationTypeFormContainer = connect(state => {
    const publicationTypeState = state.get('publicationTypes');
    return {
        publicationTypeList: publicationTypeState.get('publicationTypeList')
    };
}, dispatch => {
    return {
        loadPublicationTypesList: () => dispatch(loadPublicationTypesList()),
        loadSelectedPublicationType: (obj, selectedId) => dispatch(loadSelectedPublicationType(selectedId))
    };
})(PublicationTypeFormContainer);

export default PublicationTypeFormContainer;
