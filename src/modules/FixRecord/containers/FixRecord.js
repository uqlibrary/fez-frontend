import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, getFormValues, getFormSyncErrors, SubmissionError, stopSubmit } from 'redux-form/immutable';
import Immutable from 'immutable';
import FixRecord from '../components/FixRecord';
import * as actions from 'actions';
const FORM_NAME = 'FixRecord';

const onSubmit = (values, dispatch, props) => {
    const data = {
        ...values.toJS(),
        publication: { ...props.recordToFix },
        author: { ...props.author },
    };
    return dispatch(data.fixAction === 'unclaim' ? actions.unclaimRecord(data) : actions.fixRecord(data)).catch(
        error => {
            throw new SubmissionError({ _error: error.message });
        },
    );
};

const validate = values => {
    stopSubmit(FORM_NAME, null);
    const data = values.toJS();

    const initialContentIndicators = (
        (data.publication && data.publication.fez_record_search_key_content_indicator) ||
        []
    ).map(item => item.rek_content_indicator);
    const hasAddedContentIndicators =
        data.contentIndicators &&
        data.contentIndicators.some(indicator => initialContentIndicators.indexOf(indicator) === -1);

    const hasFiles = data.files && data.files.queue && data.files.queue.length > 0;
    const errors = {};
    if (data.fixAction === 'fix' && !hasAddedContentIndicators && !data.comments && !data.rek_link && !hasFiles) {
        errors.fixRecordAnyField = true;
    }
    return errors;
};

let FixRecordContainer = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    validate,
    onSubmit,
})(FixRecord);

const mapStateToProps = state => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    const recordToFix = state.get('fixRecordReducer') && state.get('fixRecordReducer').recordToFix;
    const contentIndicators =
        (!!recordToFix &&
            (recordToFix.fez_record_search_key_content_indicator || []).map(item => item.rek_content_indicator)) ||
        [];
    return {
        ...state.get('fixRecordReducer'),
        ...state.get('accountReducer'),
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        initialValues: {
            publication: recordToFix,
            contentIndicators,
        },
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

FixRecordContainer = connect(mapStateToProps, mapDispatchToProps)(FixRecordContainer);

export default FixRecordContainer;
