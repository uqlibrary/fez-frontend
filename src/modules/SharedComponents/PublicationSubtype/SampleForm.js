import React from 'react';
import Immutable from 'immutable';
import {connect} from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form/immutable';
import { Field } from 'redux-form';
import { StandardCard } from 'uqlibrary-react-toolbox';
import { PublicationSubtypeField } from '.';
import PublicationSubtypeForm from './components/PublicationSubtypeForm';

class SampleForm extends React.Component {
    render() {
        return(
            <form>
                <StandardCard>
                    <h3>Publication Subtypes</h3>
                    <Field name="rek_subtype" component={ PublicationSubtypeField } vocabId={ 123 } />
                    <PublicationSubtypeForm vocabId={ 123 }/>
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
