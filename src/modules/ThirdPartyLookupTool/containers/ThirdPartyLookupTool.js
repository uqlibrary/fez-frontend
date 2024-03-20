import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';

import ThirdPartyLookupTool from '../components/ThirdPartyLookupTool';

const mapStateToProps = state => {
    return {
        ...state.get('thirdPartyLookupToolReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const ThirdPartyLookupContainer = connect(mapStateToProps, mapDispatchToProps)(ThirdPartyLookupTool);

export default ThirdPartyLookupContainer;
