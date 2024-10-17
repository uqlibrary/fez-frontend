import { connect } from 'react-redux';
import App from '../components/App';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';
import { pathConfig } from 'config';

export const customRedirectors = {
    adrd: {
        condition: '1',
        assert: ({ value, condition, account }) => {
            return account && account?.canMasquerade && account?.canMasqueradeType === 'full' && value === condition;
        },
        to: { url: pathConfig.admin.dashboard, options: { replace: true } },
    },
};

const mapStateToProps = state => ({
    ...state.get('accountReducer'),
    incompleteRecordList: state.get('publicationsReducer'),
    loadingIncompleteRecordData: state.get('publicationsReducer').loadingPublicationsList,
    customRedirectors,
});

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
export default AppContainer;
