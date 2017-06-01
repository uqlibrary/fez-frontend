import {connect} from 'react-redux';

import {reduxForm, getFormValues} from 'redux-form/immutable';
import Metadata from '../components/Metadata';
import Immutable from 'immutable';
import {previousPage, increaseStep} from '../actions';

let MetadataContainer = reduxForm({
    destroyOnUnmount: false
})(Metadata);

MetadataContainer = connect((state, initialProps) => {
    return {
        formValues: getFormValues(initialProps.form || 'AuthorForm')(state) || Immutable.Map({})
    };
}, dispatch => {
    return {
        increaseStep: () => dispatch(increaseStep()),
        previousPage: () => dispatch(previousPage())
    };
})(MetadataContainer);

export default MetadataContainer;
