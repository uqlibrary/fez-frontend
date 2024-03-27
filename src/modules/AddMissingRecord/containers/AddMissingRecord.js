import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';
import AddMissingRecord from '../components/AddMissingRecord';

const mapStateToProps = state => {
    return {
        ...(state && state.get('searchRecordsReducer') ? state.get('searchRecordsReducer') : {}),
        ...(state && state.get('createRecordReducer') ? state.get('createRecordReducer') : {}),
        account: state && state.get('accountReducer') ? state.get('accountReducer').account : null,
        author: state && state.get('accountReducer') ? state.get('accountReducer').author : null,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const AddMissingRecordContainer = connect(mapStateToProps, mapDispatchToProps)(AddMissingRecord);

export default AddMissingRecordContainer;
