import {connect} from 'react-redux';
import AddRecord from '../components/AddRecord';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
    return {
        publicationsList: state.get('addRecordReducer') ? state.get('addRecordReducer').publicationsList : {},
        loadingSearch: state.get('addRecordReducer').loadingSearch,
        loadingPublicationSources: state.get('addRecordReducer') ? state.get('addRecordReducer').loadingPublicationSources : {}
    };
};

let AddRecordContainer = connect(mapStateToProps)(AddRecord);
AddRecordContainer = withRouter(AddRecordContainer);

export default AddRecordContainer;
