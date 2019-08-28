import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

const AppAlert = ({ appAlert }) => {
    if (!appAlert) return null;

    return (
        <div className="dashAlert">
            <div className="layout-card">
                <Alert {...appAlert} />
            </div>
        </div>
    );
};

AppAlert.propTypes = {
    appAlert: PropTypes.object,
};

const mapStateToProps = state => ({
    appAlert:
        state.get('appReducer') && state.get('appReducer').appAlert ? { ...state.get('appReducer').appAlert } : null,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

const AppAlertContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AppAlert);

export default AppAlertContainer;
