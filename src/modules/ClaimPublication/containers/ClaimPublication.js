import {connect} from 'react-redux';
import ClaimPublication from '../components/ClaimPublication';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
    return {
        publicationsList: state.get('claimPublicationReducer') ? state.get('claimPublicationReducer').publicationsList : {},
        loadingSearch: state.get('claimPublicationReducer').loadingSearch
    };
};

let ClaimPublicationContainer = connect(mapStateToProps)(ClaimPublication);
ClaimPublicationContainer = withRouter(ClaimPublicationContainer);

export default ClaimPublicationContainer;
