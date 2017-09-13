import {connect} from 'react-redux';
import Research from '../components/Research';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';

const mapStateToProps = (state) => {
    return {
        account: state.get('accountReducer').account,
        accountLoading: state.get('accountReducer').accountLoading,
        ...state.get('publicationsReducer')
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let ResearchContainer = connect(mapStateToProps, mapDispatchToProps)(Research);
ResearchContainer = withRouter(ResearchContainer);
export default ResearchContainer;
