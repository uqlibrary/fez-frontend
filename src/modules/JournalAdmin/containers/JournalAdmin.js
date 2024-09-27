/* istanbul ignore file */
import * as actions from 'actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { adminInterfaceConfig, valueExtractor } from 'config/journalAdmin';
import { ADMIN_JOURNAL, PUBLICATION_TYPE_DATA_COLLECTION } from 'config/general';
import JournalAdminContainer from '../components/JournalAdminContainer';
export const filesParams = record => ({
    isDataset: record.rek_display_type === PUBLICATION_TYPE_DATA_COLLECTION,
});

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

const mapStateToProps = state => {
    let initialFormValues = {};
    let journalToView = {};
    let locked = false;

    journalToView = state.get('viewJournalReducer').journalToView;

    locked = state.get('viewJournalReducer').isJournalLocked;
    initialFormValues = (!!journalToView && journalToView.jnl_jid && getInitialFormValues(journalToView)) || {};

    return {
        journalToViewLoading: state.get('viewJournalReducer').loadingJournalToView,
        authorDetails: state.get('accountReducer').authorDetails || null,
        author: state.get('accountReducer').author,
        journalToView,
        journalToViewError: state.get('viewJournalReducer').journalToViewError,
        journalLoadingError: state.get('viewJournalReducer').journalLoadingError,
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

const AdminReduxFormContainer = connect(mapStateToProps, mapDispatchToProps)(JournalAdminContainer);

export default AdminReduxFormContainer;
