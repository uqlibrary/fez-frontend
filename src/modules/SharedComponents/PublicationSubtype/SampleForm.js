import React from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form/immutable';
import { Field } from 'redux-form';
import { StandardCard } from 'uqlibrary-react-toolbox';
import { PublicationSubtype } from '.';
import { getPublicationSubtypesList } from '../../../repositories';

class SampleForm extends React.Component {
    static propTypes = {
        vocabId: PropTypes.number.isRequired

    };

    constructor(props) {
        super(props);
        this.list = [];
    }

    componentDidMount() {
        getPublicationSubtypesList(this.props.vocabId).then(data => {
            this.list = data;
        });
    }

    render() {
        return(
            <form>
                <StandardCard>
                    <h3>Publication Subtypes</h3>
                    <Field name="subtypeOne" component={ PublicationSubtype } list={ this.list } />
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
