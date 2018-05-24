import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ViewRecord from '../components/ViewRecord';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';

const mapStateToProps = (state) => {
    return {
        ...state.get('viewRecordReducer'),
        ...state.get('accountReducer')
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let ViewRecordContainer = connect(mapStateToProps, mapDispatchToProps)(ViewRecord);
ViewRecordContainer = withRouter(ViewRecordContainer);
export default ViewRecordContainer;
