import React from 'react';
import { useLocation, useNavigate, useNavigationType, useParams } from 'react-router-dom';

/* c8 ignore next */
export const withNavigate = () => Component => props => {
    const navigate = useNavigate();
    const navigationType = useNavigationType();
    const location = useLocation();
    const params = useParams();
    return (
        <Component {...props} navigate={navigate} navigationType={navigationType} location={location} params={params} />
    );
};
