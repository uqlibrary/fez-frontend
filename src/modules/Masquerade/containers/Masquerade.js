import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';

import Masquerade from '../components/Masquerade';

const mapStateToProps = (state) => (
    {
        ...state.get('accountReducer')
    }
);

const mapDispatchToProps = (dispatch) => (
    {
        actions: bindActionCreators(actions, dispatch)
    }
);

let MasqueradeContainer = connect(mapStateToProps, mapDispatchToProps)(Masquerade);
MasqueradeContainer = withRouter(MasqueradeContainer);

export default MasqueradeContainer;
