import * as actions from 'actions';
import { connect } from 'react-redux';
import { getFormSyncErrors, getFormValues, reduxForm } from 'redux-form/immutable';
import Immutable from 'immutable';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';

import { adminInterfaceConfig, validate, valueExtractor } from 'config/journalAdmin';
import { ADMIN_JOURNAL } from 'config/general';
import JournalAdminContainer from '../components/JournalAdminContainer';
import { FORM_NAME } from '../constants';
import { onSubmit } from '../submitHandler';

const getInitialValues = (journal, tab, tabParams = () => {}) => {
    return (adminInterfaceConfig[ADMIN_JOURNAL] || {})
        [tab](tabParams(journal))
        .map(card => card.groups.reduce((groups, group) => [...groups, ...group], []))
        .reduce((groups, group) => [...groups, ...group], [])
        .reduce((initialValue, field) => {
            return {
                ...initialValue,
                [field]: valueExtractor[field].getValue(journal),
            };
        }, {});
};

const getInitialFormValues = journalToView => {
    return {
        initialValues: {
            id: journalToView.jnl_jid,
            journal: journalToView,
            adminSection: getInitialValues(journalToView, 'admin'),
            bibliographicSection: getInitialValues(journalToView, 'bibliographic'),
            uqDataSection: getInitialValues(journalToView, 'uqData')?.uqData || {},
            doajSection: getInitialValues(journalToView, 'doaj')?.doaj || {},
            indexedSection: getInitialValues(journalToView, 'indexed')?.indexed || {},
        },
    };
};

const PrototypeContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
    validate,
    destroyOnUnmount: false,
})(JournalAdminContainer);

const mapStateToProps = state => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    const formValues = getFormValues(FORM_NAME)(state) || Immutable.Map({});

    let initialFormValues = {};
    let journalToView = {};
    let locked = false;

    journalToView = state.get('journalReducer').journalDetails;

    locked = state.get('journalReducer').isJournalLocaked;
    initialFormValues = getInitialFormValues(journalToView) || {};

    return {
        formValues,
        formErrors,
        disableSubmit: !!journalToView && formErrors && !(formErrors instanceof Immutable.Map),
        journalToViewLoading: state.get('journalReducer').journalLoading,
        authorDetails: state.get('accountReducer').authorDetails || null,
        author: state.get('accountReducer').author,
        journalToView,
        journalToViewError: state.get('journalReducer').journalToViewError,
        ...initialFormValues,
        locked,
        error: state.get('journalReducer').error,
    };
};

function mapDispatchToProps(dispatch) {
    const { loadJournal, adminJournalClear, adminUnlockJournal } = bindActionCreators(actions, dispatch);
    return {
        loadJournalToView: loadJournal,
        clearJournalToView: adminJournalClear,
        unlockJournal: adminUnlockJournal,
    };
}

const AdminReduxFormContainer = connect(mapStateToProps, mapDispatchToProps)(PrototypeContainer);

export default withRouter(AdminReduxFormContainer);
