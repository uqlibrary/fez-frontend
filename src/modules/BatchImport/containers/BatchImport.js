import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Immutable from 'immutable';
import { reduxForm, getFormValues, getFormSyncErrors, SubmissionError } from 'redux-form/immutable';

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

let BatchImportContainer = ({ formErrors, formValues, collectionItems, ...props }) => {
    const communityID = formValues.toJS().communityID;
    const collectionsList = collectionItems.map((item, index) => {
        return { text: item.rek_title, value: item.rek_pid, index: index + 1 };
    });
    return (
        <FormErrorsContext.Provider value={{ formErrors }}>
            <BatchImport {...{ ...props, communityID, collectionsList }} />
        </FormErrorsContext.Provider>
    );
};

BatchImportContainer.propTypes = {
    disableSubmit: PropTypes.bool,
    collectionItems: PropTypes.array,
    formErrors: PropTypes.object,
    formValues: PropTypes.object,
};

const isCommunityUnchanged = (prevProps, nextProps) =>
    prevProps.formValues.toJS().communityID === nextProps.formValues.toJS().communityID;

BatchImportContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(confirmDiscardFormChanges(React.memo(BatchImportContainer, isCommunityUnchanged), FORM_NAME));

const mapStateToProps = state => {
    const formErrors = (state && getFormSyncErrors(FORM_NAME)(state)) || Immutable.Map({});
    const formValues = (state && getFormValues(FORM_NAME)(state)) || Immutable.Map({});

    const collectionItems = state.get('collectionsReducer').itemsList;

    return {
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        formErrors,
        formValues,
        collectionItems,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        loadItemsList: communityID => dispatch(actions.collectionsList(communityID)),
    };
}

BatchImportContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(BatchImportContainer);

BatchImportContainer = withRouter(React.memo(BatchImportContainer, () => true));
export default React.memo(BatchImportContainer);
