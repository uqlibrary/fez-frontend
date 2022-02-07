import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';
import PossiblyMyRecords from '../components/PossiblyMyRecords';
import { withRouter } from 'react-router-dom';

const mapStateToProps = state => {
    return {
        ...(state && state.get('claimPublicationReducer') ? state.get('claimPublicationReducer') : {}),
        ...state.get('accountReducer'),
        accountLoading: state && state.get('accountReducer') ? state.get('accountReducer').accountLoading : false,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

let ClaimPublicationContainer = connect(mapStateToProps, mapDispatchToProps)(PossiblyMyRecords);
ClaimPublicationContainer = withRouter(ClaimPublicationContainer);

export default ClaimPublicationContainer;
