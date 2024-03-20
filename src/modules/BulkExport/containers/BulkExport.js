import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BulkExport from '../components/BulkExport';
import * as actions from 'actions';

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(BulkExport);
