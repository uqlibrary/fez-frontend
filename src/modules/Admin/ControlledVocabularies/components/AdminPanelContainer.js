import AdminPanel from './AdminPanel';
import PropTypes from 'prop-types';
import React from 'react';

const AdminPanelContainer = props => {
    const onSubmit = data => {
        props.onAction(props.parentId ?? null)(data);
    };

    return <AdminPanel onSubmit={onSubmit} initialValues={props.initialValues} {...props} />;
};

AdminPanelContainer.propTypes = {
    onAction: PropTypes.func,
    parentId: PropTypes.string,
    initialValues: PropTypes.object,
};

export default AdminPanelContainer;
