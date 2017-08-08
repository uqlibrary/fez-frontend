import {connect} from 'react-redux';
import AddRecord from '../components/AddRecord';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';

const mapStateToProps = (state) => {
    return {
        ...state.get('searchRecordsReducer')
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let AddRecordContainer = connect(mapStateToProps, mapDispatchToProps)(AddRecord);
AddRecordContainer = withRouter(AddRecordContainer);
export default AddRecordContainer;
