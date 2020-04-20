import { connect } from 'react-redux';

import DashboardOrcidSync from '../components/DashboardOrcidSync';
import { hide } from 'modules/SharedComponents/Toolbox/HelpDrawer/actions';

const mapStateToProps = state => {
    return state.get('helpDrawer') ? state.get('helpDrawer').toJS() : { open: false, title: '', text: '' };
};

const mapDispatchToProps = dispatch => {
    return {
        hideDrawer: () => dispatch(hide()),
    };
};

const DashboardOrcidSyncContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(DashboardOrcidSync);

export default DashboardOrcidSyncContainer;
