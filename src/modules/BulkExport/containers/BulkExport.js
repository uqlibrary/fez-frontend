import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BulkExport from '../components/BulkExport';
import * as actions from 'actions';
import { withRouter } from 'react-router-dom';

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

export default withRouter(connect(null, mapDispatchToProps)(BulkExport));
