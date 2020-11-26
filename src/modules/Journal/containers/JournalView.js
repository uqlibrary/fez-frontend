import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import JournalView from '../components/JournalView';

import * as actions from 'actions';

const mapStateToProps = state => {
    const { journalDetails = false, journalLoading = false, journalLoadingError = false } = state.get('journalReducer');
    return {
        journalDetails,
        journalLoading,
        journalLoadingError,
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(JournalView));
