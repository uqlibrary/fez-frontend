import { connect } from 'react-redux';
import PublicationCitation from '../components/PublicationCitation';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

const mapStateToProps = state => ({
    hideViewFullStatisticsLink: !(state.get('accountReducer') && state.get('accountReducer').account),
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

let PublicationCitationContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PublicationCitation);
PublicationCitationContainer = withRouter(PublicationCitationContainer);
export default PublicationCitationContainer;
