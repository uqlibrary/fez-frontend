import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import locale from 'locale/pages';

const StyledAvatar = styled(Avatar)({
    backgroundSize: 'cover, cover',
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: '125px',
    height: '125px',
    margin: '8px',
});

const DashboardAuthorAvatar = ({ values }) => {
    const txt = locale.pages.dashboard.header.dashboardAuthorAvatar;
    return (
        <StyledAvatar
            src={`https://its-ss-academicportal.s3.amazonaws.com/prod/uqresearchers/photo/thumbnail_${values.uqr_id}.jpg`}
            aria-label={`${txt.ariaPrefix} ${values.title} ${values.givenName} ${values.familyName}`}
            title={`${values.title} ${values.givenName} ${values.familyName}`}
        />
    );
};

DashboardAuthorAvatar.propTypes = {
    values: PropTypes.shape({
        uqr_id: PropTypes.any,
        title: PropTypes.string,
        familyName: PropTypes.string,
        givenName: PropTypes.string,
    }),
};

export default DashboardAuthorAvatar;
