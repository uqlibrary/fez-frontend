import {connect} from 'react-redux';
import {reduxForm, getFormValues} from 'redux-form/immutable';
import Immutable from 'immutable';

import PublicationTypeForm from '../components/PublicationTypeForm';
import {loadSelectedPublicationType, clearSelectedPublicationType} from '../actions';


let PublicationTypeFormContainer = reduxForm({
    form: 'PublicationTypeForm'
})(PublicationTypeForm);

PublicationTypeFormContainer = connect((state) => {
    return {
        formValues: getFormValues('PublicationTypeForm')(state) || Immutable.Map({})
    };
}, dispatch => {
    return {
        loadSelectedPublicationType: (obj, selectedId) => dispatch(loadSelectedPublicationType(selectedId)),
        clearSelectedPublicationType: () => dispatch(clearSelectedPublicationType())
    };
})(PublicationTypeFormContainer);

export default PublicationTypeFormContainer;
