import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import ThirdPartyLookupTool from '../components/ThirdPartyLookupTool';

const mapStateToProps = (state) => {
    return {
        ...state.get('thirdPartyLookupToolReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

let ThirdPartyLookupContainer = connect(mapStateToProps, mapDispatchToProps)(ThirdPartyLookupTool);
ThirdPartyLookupContainer = withRouter(ThirdPartyLookupContainer);

export default ThirdPartyLookupContainer;
