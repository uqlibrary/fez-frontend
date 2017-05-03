import {connect} from 'react-redux';
import {reduxForm} from 'redux-form/immutable';

import PublicationTypeForm from '../components/PublicationTypeForm';
import {loadSelectedPublicationType} from '../actions';


let PublicationTypeFormContainer = reduxForm({
    form: 'PublicationTypeForm'
})(PublicationTypeForm);

PublicationTypeFormContainer = connect(null, dispatch => {
    return {
        loadSelectedPublicationType: (obj, selectedId) => dispatch(loadSelectedPublicationType(selectedId))
    };
})(PublicationTypeFormContainer);

export default PublicationTypeFormContainer;
