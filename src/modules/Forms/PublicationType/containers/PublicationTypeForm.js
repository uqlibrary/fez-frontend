import {connect} from 'react-redux';
import {reduxForm} from 'redux-form/immutable';

import PublicationTypeForm from '../components/PublicationTypeForm';
import {loadPublicationTypes, getSelectedPublicationType} from '../actions';


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
        loadPublicationTypes: () => dispatch(loadPublicationTypes()),
        getSelectedPublicationType: (obj, selectedId) => dispatch(getSelectedPublicationType(selectedId))
    };
})(PublicationTypeFormContainer);

export default PublicationTypeFormContainer;
