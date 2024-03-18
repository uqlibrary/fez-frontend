import { connect } from 'react-redux';
import PublicationCitation from '../components/PublicationCitation';
import { bindActionCreators } from 'redux';
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

const PublicationCitationContainer = connect(mapStateToProps, mapDispatchToProps)(PublicationCitation);
export default PublicationCitationContainer;
