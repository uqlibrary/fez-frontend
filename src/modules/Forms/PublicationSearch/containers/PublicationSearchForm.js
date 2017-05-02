import {connect} from 'react-redux';

import {reduxForm, getFormValues} from 'redux-form/immutable';
import PublicationSearchForm from '../components/PublicationSearchForm';
import {validate} from '../validator';
import Immutable from 'immutable';
import {loadDoiResultsList, loadPubmedResultsList, loadTitleResultsList} from '../actions';

let PublicationSearchFormContainer = reduxForm({
    form: 'PublicationSearchForm',
    validate
})(PublicationSearchForm);

PublicationSearchFormContainer = connect((state) => {
    return {
        formValues: getFormValues('PublicationSearchForm')(state) || Immutable.Map({})
    };
}, dispatch => {
    return {
        loadDoiResultsList: doi => dispatch(loadDoiResultsList(doi)),
        loadPubmedResultsList: pubMedId => dispatch(loadPubmedResultsList(pubMedId)),
        loadTitleResultsList: (rekDisplayType, title) => dispatch(loadTitleResultsList(rekDisplayType, title))
    };
})(PublicationSearchFormContainer);

export default PublicationSearchFormContainer;
