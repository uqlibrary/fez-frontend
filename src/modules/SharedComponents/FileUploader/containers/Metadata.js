import {connect} from 'react-redux';

import {reduxForm, getFormValues} from 'redux-form/immutable';
import Metadata from '../components/Metadata';
import Immutable from 'immutable';
import {closeDialog, increaseStep, decreaseStep} from '../actions';

let MetadataContainer = reduxForm({
    destroyOnUnmount: false
})(Metadata);

MetadataContainer = connect((state, initialProps) => {
    return {
        formValues: getFormValues(initialProps.form || 'AuthorForm')(state) || Immutable.Map({})
    };
}, dispatch => {
    return {
        closeDialog: () => dispatch(closeDialog()),
        decreaseStep: () => dispatch(decreaseStep()),
        increaseStep: () => dispatch(increaseStep())
    };
})(MetadataContainer);

export default MetadataContainer;
