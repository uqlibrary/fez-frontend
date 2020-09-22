import { connect } from 'react-redux';
import PublicationCitation from '../components/PublicationCitation';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

const mapStateToProps = state => {
    const account = (state.get('accountReducer') || {}).account;
    return {
        hideViewFullStatisticsLink: !account,
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

let PublicationCitationContainer = connect(mapStateToProps, mapDispatchToProps)(PublicationCitation);
PublicationCitationContainer = withRouter(PublicationCitationContainer);
export default PublicationCitationContainer;
