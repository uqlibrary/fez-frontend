import React from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

const AppAlert = () => {
    const appAlert = useSelector(state => (state.get('appReducer') || {}).appAlert);

    if (!appAlert) return '';

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

export default AppAlert;
