import {connect} from 'react-redux';
import ClaimPublication from '../components/ClaimPublication';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
    return {
        ...state.get('claimPublicationReducer'),
        ...state.get('currentAuthorReducer')
    };
};

let ClaimPublicationContainer = connect(mapStateToProps)(ClaimPublication);
ClaimPublicationContainer = withRouter(ClaimPublicationContainer);

export default ClaimPublicationContainer;
