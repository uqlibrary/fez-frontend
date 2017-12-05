import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Orcid from '../components/Orcid';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';

const mapStateToProps = (state) => {
    return {
        ...state.get('accountReducer')
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

const OrcidContainer = connect(mapStateToProps, mapDispatchToProps)(Orcid);

export default withRouter(OrcidContainer);
