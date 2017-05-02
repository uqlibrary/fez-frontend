import {connect} from 'react-redux';

import {reduxForm, getFormValues} from 'redux-form/immutable';
import PublicationSearchForm from '../components/PublicationSearchForm';
import {validate} from '../validator';
import Immutable from 'immutable';
import {doiSearch, pubMedSearch, titleSearch} from '../actions';

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
        doiSearch: doi => dispatch(doiSearch(doi)),
        pubMedSearch: pubMedId => dispatch(pubMedSearch(pubMedId)),
        titleSearch: (rekDisplayType, title) => dispatch(titleSearch(rekDisplayType, title))
    };
})(PublicationSearchFormContainer);

export default PublicationSearchFormContainer;
