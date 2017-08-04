import React from 'react';
import Immutable from 'immutable';
import {connect} from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form/immutable';
import { Field } from 'redux-form';
import { FileUploadField } from '.';

class SampleForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <form>
                <Field name="files_uploaded" component={ FileUploadField } />
            </form>
        );
    }
}

const SampleReduxForm = reduxForm({
    form: 'SampleForm'
})(SampleForm);

const mapStateToProps = (state) => {
    return {
        formValues: getFormValues('SampleForm')(state) || Immutable.Map({})
    };
};

export default connect(mapStateToProps)(SampleReduxForm);
