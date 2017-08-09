import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ClaimPublication from '../components/ClaimPublication';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';

const mapStateToProps = (state) => {
    return {
        ...state.get('claimPublicationReducer'),
        author: state.get('accountReducer').author
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}


let ClaimPublicationContainer = connect(mapStateToProps, mapDispatchToProps)(ClaimPublication);
ClaimPublicationContainer = withRouter(ClaimPublicationContainer);

export default ClaimPublicationContainer;
