import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import locale from 'locale/pages';

const profileFallbackImage = require('../../../../public/images/avatar.svg');

const DashboardAuthorAvatar = ({ values }) => {
    const txt =  locale.pages.dashboard.header.dashboardAuthorAvatar;
    return (
        <Avatar
            style={{
                backgroundImage: `url("https://its-ss-uqresearchers.s3.amazonaws.com/photo/thumbnail_${values.uqr_id}.jpg"), url(${profileFallbackImage})`,
                backgroundSize: 'cover, cover',
                backgroundColor: 'transparent',
                width: 125,
                height: 125,
                margin: 8,
            }}
            aria-label={`${txt.ariaPrefix} ${values.title} ${values.givenName} ${values.familyName}`}
            title={`${values.title} ${values.givenName} ${values.familyName}`} />
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
