import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';

import AdminLookupTool from '../components/AdminLookupTool';

const mapStateToProps = (state) => {
    return {
        ...state.get('accountReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let AdminLookupContainer = connect(mapStateToProps, mapDispatchToProps)(AdminLookupTool);
AdminLookupContainer = withRouter(AdminLookupContainer);

export default AdminLookupContainer;
