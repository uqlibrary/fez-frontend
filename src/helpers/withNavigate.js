import React from 'react';
import { useLocation, useNavigate, useNavigationType, useParams } from 'react-router-dom';

/* istanbul ignore next */
export const withNavigate = () => Component => props => {
    const navigate = useNavigate();
    const navigateType = useNavigationType();
    const location = useLocation();
    const params = useParams();
    return <Component {...props} navigate={navigate} navigateType={navigateType} location={location} params={params} />;
};
