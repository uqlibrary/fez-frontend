import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';
import AddMissingRecord from '../components/AddMissingRecord';
import { withRouter } from 'react-router-dom';

const mapStateToProps = (state, props) => {
    return {
        ...(state && state.get('searchRecordsReducer') ? state.get('searchRecordsReducer') : {}),
        ...(state && state.get('createRecordReducer') ? state.get('createRecordReducer') : {}),
        account: state && state.get('accountReducer') ? state.get('accountReducer').account : null,
        author: state && state.get('accountReducer') ? state.get('accountReducer').author : null,
        initialValues: {
            rek_title: props.rawSearchQuery || '',
        },
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

let AddMissingRecordContainer = connect(mapStateToProps, mapDispatchToProps)(AddMissingRecord);
AddMissingRecordContainer = withRouter(AddMissingRecordContainer);

export default AddMissingRecordContainer;
