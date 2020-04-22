import { connect } from 'react-redux';
import PublicationCitation from '../components/PublicationCitation';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';
import { USER_IDS_WITH_LEGACY_LINK } from 'config/admin/adminInterface';

const mapStateToProps = state => {
    const account = (state.get('accountReducer') || {}).account;
    return {
        hideViewFullStatisticsLink: !account,
        userHasNewAdminEdit: !!account && !!account.id && USER_IDS_WITH_LEGACY_LINK.includes(account.id),
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

let PublicationCitationContainer = connect(mapStateToProps, mapDispatchToProps)(PublicationCitation);
PublicationCitationContainer = withRouter(PublicationCitationContainer);
export default PublicationCitationContainer;
