import { connect } from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import PublicationTypeForm from '../components/PublicationTypeForm';

import {loadPublicationTypes} from '../actions';


let PublicationTypeFormContainer = reduxForm({
    form: 'PublicationTypeForm'
})(PublicationTypeForm);

PublicationTypeFormContainer = connect(state => {
    const publicationTypeState = state.get('publicationTypes');
    return {
        types: publicationTypeState.get('publicationTypes')
    };
}, dispatch => {
    return {
        loadPublicationTypes: () => dispatch(loadPublicationTypes())
    };
})(PublicationTypeFormContainer);

export default PublicationTypeFormContainer;
