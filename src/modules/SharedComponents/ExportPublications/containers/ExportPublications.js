import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from 'actions';
import ExportPublications from '../components/ExportPublications';

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

const ExportPublicationsContainer = connect(() => ({}), mapDispatchToProps)(ExportPublications);

export default ExportPublicationsContainer;
