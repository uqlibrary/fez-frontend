import React from 'react';
import {connect} from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form/immutable';
import { Field } from 'redux-form';
import { FileUploadField } from '.';
import { StandardCard } from 'uqlibrary-react-toolbox';

class SampleForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <StandardCard title="Files">
                <form>
                    <Field type="file" name="files_uploaded" component={ FileUploadField } defaultConfig={{ maxFileSize: 100, fileSizeUnit: 'K', fileUploadLimit: 4 }} />
                </form>
            </StandardCard>
        );
    }
}

const SampleReduxForm = reduxForm({
    form: 'SampleForm'
})(SampleForm);

const mapStateToProps = (state) => {
    return {
        formValues: getFormValues('SampleForm')(state) || {}
    };
};

export default connect(mapStateToProps)(SampleReduxForm);
