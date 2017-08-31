import {connect} from 'react-redux';
import Research from '../components/Research';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';

const mapStateToProps = (state) => {
    return {
        author: state.get('accountReducer').author,
        authorLoading: state.get('accountReducer').authorLoading
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
