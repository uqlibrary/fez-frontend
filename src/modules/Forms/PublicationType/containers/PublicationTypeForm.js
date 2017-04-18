import { connect } from 'react-redux';

import {reduxForm, getFormValues} from 'redux-form/immutable';
import PublicationTypeForm from '../components/PublicationTypeForm';
import Immutable from 'immutable';
import {loadPublicationTypes} from '../actions';


let PublicationTypeFormContainer = reduxForm({
    form: 'PublicationTypeForm'
})(PublicationTypeForm);

PublicationTypeFormContainer = connect(state => {
    const publicationTypeState = state.get('publicationTypes');
    return {
        types: publicationTypeState.get('publicationTypes'),
        formValues: getFormValues('PublicationTypeForm')(state) || Immutable.Map({})
    };
}, dispatch => {
    return {
        loadPublicationTypes: () => dispatch(loadPublicationTypes())
    };
})(PublicationTypeFormContainer);

export default PublicationTypeFormContainer;
