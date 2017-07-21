import {connect} from 'react-redux';
import AddRecord from '../components/AddRecord';


const mapStateToProps = (state) => {
    return {
        publicationsList: state.get('addRecordReducer') ? state.get('addRecordReducer').get('publicationsList') : {},
        loadingSearch: state.get('addRecordReducer').get('loadingSearch'),
        // authorsList: state.get('authorsReducer').authorsList || []
    };
};

const AddRecordContainer = connect(mapStateToProps)(AddRecord);
export default AddRecordContainer;
