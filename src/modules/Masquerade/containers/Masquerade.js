import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';

import Masquerade from '../components/Masquerade';

const mapStateToProps = state => {
    return {
        ...state.get('accountReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const MasqueradeContainer = connect(mapStateToProps, mapDispatchToProps)(Masquerade);

export default MasqueradeContainer;
