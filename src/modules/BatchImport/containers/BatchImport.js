import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Immutable from 'immutable';
import { change, getFormSyncErrors, getFormValues, reduxForm, SubmissionError } from 'redux-form/immutable';

import BatchImport, { FORM_NAME } from '../components/BatchImport';

import * as actions from 'actions';
import { FormErrorsContext } from 'context';
import { PUBLICATION_TYPE_DESIGN } from 'config/general';
import { publicationTypes } from 'config';

const onSubmit = (values, dispatch) => {
    const data = { ...values.toJS() };
    return dispatch(actions.createBatchImport(data))
        .then(response => {
            if (!response || !response.data) {
                throw new SubmissionError();
            }
        })
        .catch(error => {
            throw new SubmissionError({ _error: error.message });
        });
};

let BatchImportContainer = ({ formErrors, formValues, ...props }) => {
    const componentProps = {
        ...props,
        communityID: formValues.toJS().communityID,
    };

    return (
        <FormErrorsContext.Provider value={{ formErrors }}>
            <BatchImport {...componentProps} />
        </FormErrorsContext.Provider>
    );
};

BatchImportContainer.propTypes = {
    formErrors: PropTypes.object,
    formValues: PropTypes.object,
};

BatchImportContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(React.memo(BatchImportContainer));

const mapStateToProps = state => {
    const formErrors = (state && getFormSyncErrors(FORM_NAME)(state)) || Immutable.Map({});
    const formValues = (state && getFormValues(FORM_NAME)(state)) || Immutable.Map({});
    const isDesignType = formValues.get('doc_type_id') === PUBLICATION_TYPE_DESIGN;

    const designSubtypes = isDesignType ? publicationTypes(null, true)[PUBLICATION_TYPE_DESIGN].subtypes : null;

    return {
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        isDesignType,
        designSubtypes,
        formErrors,
        formValues,
    };
};

const mapDispatchToProps = dispatch => ({
    loadItemsList: communityID => dispatch(actions.collectionsList(communityID)),
    resetCollectionField: () => {
        dispatch(change(FORM_NAME, 'collection_pid', null));
    },
});

BatchImportContainer = connect(mapStateToProps, mapDispatchToProps)(BatchImportContainer);

export default withRouter(BatchImportContainer);
