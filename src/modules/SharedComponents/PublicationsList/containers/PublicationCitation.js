import {connect} from 'react-redux';
import PublicationCitation from '../components/PublicationCitation';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';

const mapStateToProps = () => {
    return {};
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let PublicationCitationContainer = connect(mapStateToProps, mapDispatchToProps)(PublicationCitation);
PublicationCitationContainer = withRouter(PublicationCitationContainer);
export default PublicationCitationContainer;
