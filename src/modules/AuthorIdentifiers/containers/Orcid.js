import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';

import Orcid from '../components/Orcid';
import { withNavigate } from 'helpers/withNavigate';

const mapStateToProps = state => ({
    ...state.get('accountReducer'),
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

const OrcidContainer = connect(mapStateToProps, mapDispatchToProps)(Orcid);

export default withNavigate()(OrcidContainer);
