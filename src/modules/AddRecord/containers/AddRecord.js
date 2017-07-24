import {connect} from 'react-redux';
import AddRecord from '../components/AddRecord';

const mapStateToProps = (state) => {
    return {
        publicationsList: state.get('addRecordReducer') ? state.get('addRecordReducer').publicationsList : {},
        loadingSearch: state.get('addRecordReducer').loadingSearch,
        loadingPublicationSources: state.get('addRecordReducer') ? state.get('addRecordReducer').loadingPublicationSources : {}
    };
};

const AddRecordContainer = connect(mapStateToProps)(AddRecord);
export default AddRecordContainer;
