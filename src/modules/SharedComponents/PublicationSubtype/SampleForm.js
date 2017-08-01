import React from 'react';
import Immutable from 'immutable';
import {connect} from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form/immutable';
import { Field } from 'redux-form';
import { StandardCard } from 'uqlibrary-react-toolbox';
import { PublicationSubtype } from '.';

class SampleForm extends React.Component {
    render() {
        return(
            <form>
                <StandardCard>
                    <h3>Publication Subtypes</h3>
                    <Field name="subtypeOne" component={ PublicationSubtype } vocabId={ 453573 } />
                </StandardCard>
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
