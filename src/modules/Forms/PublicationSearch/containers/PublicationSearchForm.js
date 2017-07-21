import {connect} from 'react-redux';
import {reduxForm, getFormValues} from 'redux-form/immutable';
import Immutable from 'immutable';
import PublicationSearchForm from '../components/PublicationSearchForm';

const FORM_NAME = 'PublicationSearchForm';

let PublicationSearchFormContainer = reduxForm({
    form: FORM_NAME,
})(PublicationSearchForm);

const mapStateToProps = (state) => {
    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
    };
};

PublicationSearchFormContainer = connect(mapStateToProps)(PublicationSearchFormContainer);

export default PublicationSearchFormContainer;
