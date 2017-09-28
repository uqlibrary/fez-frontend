import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';

const mapStateToProps = (state) => {
    return {
        ...state.get('searchRecordsReducer')
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default function AddRecordStageContainer(WrappedComponent) {
    const ConnectedStage = connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
    return withRouter(ConnectedStage);
}
