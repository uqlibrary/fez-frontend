import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Immutable from 'immutable';
import { change, getFormSyncErrors, getFormValues, reduxForm, SubmissionError } from 'redux-form/immutable';

import BatchImport, { FORM_NAME } from '../components/BatchImport';

import * as actions from 'actions';
import { FormErrorsContext } from 'context';
import { confirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';

const onSubmit = (values, dispatch) => {
    const data = { ...values.toJS() };
    return dispatch(actions.createBatchImport(data))
        .then(response => {
            if (!response || !response.data) {
                throw new SubmissionError();
            }
            // console.log(`Success: ${response.data}`);
        })
        .catch(error => {
            throw new SubmissionError({ _error: error.message });
        });
};

let BatchImportContainer = ({ formErrors, formValues, ...props }) => {
    const communityID = formValues.toJS().communityID;

    return (
        <FormErrorsContext.Provider value={{ formErrors }}>
            <BatchImport {...{ ...props, communityID }} />
        </FormErrorsContext.Provider>
    );
};

BatchImportContainer.propTypes = {
    disableSubmit: PropTypes.bool,
    collectionItems: PropTypes.array,
    formErrors: PropTypes.object,
    formValues: PropTypes.object,
};

BatchImportContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(confirmDiscardFormChanges(React.memo(BatchImportContainer), FORM_NAME));

const mapStateToProps = state => {
    const formErrors = (state && getFormSyncErrors(FORM_NAME)(state)) || Immutable.Map({});
    const formValues = (state && getFormValues(FORM_NAME)(state)) || Immutable.Map({});

    return {
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        formErrors,
        formValues,
    };
};

const mapDispatchToProps = dispatch => ({
    loadItemsList: communityID => communityID && dispatch(actions.collectionsList(communityID)),
    resetCollectionField: () => dispatch(change(FORM_NAME, 'collection_pid', null)),
});

BatchImportContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(BatchImportContainer);

export default withRouter(BatchImportContainer);
