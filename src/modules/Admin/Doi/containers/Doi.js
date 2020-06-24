import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, getFormValues, SubmissionError, getFormSyncErrors } from 'redux-form/immutable';
import Immutable from 'immutable';
import { withRouter } from 'react-router-dom';

import Doi from '../components/Doi';

import pagesLocale from 'locale/pages';

import * as actions from 'actions';

const FORM_NAME = 'Doi';
const API_REQUEST_SOURCE = 'doi_preview';

export const onSubmit = (values, dispatch, { initialValues }) => {
    const { record } = initialValues.toJS();
    const doi = !!record && !!record.fez_record_search_key_doi && record.fez_record_search_key_doi.rek_doi;
    const updatedRecord = JSON.parse(JSON.stringify(record));

    if (!doi) {
        updatedRecord.fez_record_search_key_doi = {
            rek_doi: pagesLocale.pages.doi.doiTemplate(updatedRecord.rek_pid),
        };
    }

    updatedRecord._source = API_REQUEST_SOURCE;

    return dispatch(actions.updateDoi(updatedRecord)).catch(error => {
        throw new SubmissionError({ _error: error });
    });
};

/* istanbul ignore next */
const mapStateToProps = state => {
    const { recordToView: record, loadingRecordToView } = state.get('viewRecordReducer') || {};
    const { author } = state.get('accountReducer') || {};
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    return {
        author,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        formErrors: formErrors,
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        initialValues: { record },
        loadingRecordToView,
        record,
    };
};

/* istanbul ignore next */
const mapDispatchToProps = dispatch => {
    const { loadRecordToView, clearRecordToView } = bindActionCreators(actions, dispatch);
    return { loadRecordToView, clearRecordToView };
};

const DoiForm = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(Doi);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DoiForm));
