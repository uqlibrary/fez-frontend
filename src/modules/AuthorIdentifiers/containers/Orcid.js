import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import Orcid from '../components/Orcid';

const mapStateToProps = state => ({
    ...state.get('accountReducer'),
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

let OrcidContainer = connect(mapStateToProps, mapDispatchToProps)(Orcid);
OrcidContainer = withRouter(OrcidContainer);

export default OrcidContainer;
