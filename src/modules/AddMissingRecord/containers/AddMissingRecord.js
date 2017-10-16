import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from 'actions';
import AddMissingRecord from '../components/AddMissingRecord';
import {withRouter} from 'react-router-dom';

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


let AddMissingRecordContainer = connect(mapStateToProps, mapDispatchToProps)(AddMissingRecord);
AddMissingRecordContainer = withRouter(AddMissingRecordContainer);

export default AddMissingRecordContainer;
