import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AdminLookup from '../components/AdminLookup';
import * as actions from 'actions';
import {withRouter} from 'react-router-dom';

const mapStateToProps = () => {
    return {//        ...state.get('newsFeedReducer')
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let AdminLookupContainer = connect(mapStateToProps, mapDispatchToProps)(AdminLookup);
AdminLookupContainer = withRouter(AdminLookupContainer);

export default AdminLookupContainer;
