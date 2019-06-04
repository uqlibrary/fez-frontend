import {connect} from 'react-redux';
import App from '../components/App';
import {bindActionCreators} from 'redux';
import * as actions from 'actions';

const mapStateToProps = (state) => ({
    ...state.get('accountReducer'),
    incompleteRecordList: state.get('publicationsReducer'),
    loadingIncompleteRecordData: state.get('publicationsReducer').loadingPublicationsList,
});

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
export default AppContainer;
