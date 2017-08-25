import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import {locale} from 'config';

const profileFallbackImage = require('../../../../public/images/avatar.svg');

const DashboardAuthorAvatar = ({values}) => {
    const txt =  locale.pages.dashboard.header.dashboardAuthorAvatar;
    return (
        <div className="authorAvatar">
            <Avatar
                size={150}
                style={{
                    backgroundImage: `url("https://its-ss-uqresearchers.s3.amazonaws.com/photo/thumbnail_${values.uqr_id}.jpg"), url(${profileFallbackImage})`,
                    backgroundSize: 'cover, cover'
                }}
                backgroundColor="transparent"
                aria-label={`${txt.ariaPrefix} ${values.title} ${values.given_name} ${values.family_name}`}
                title={values.title + ' ' + values.given_name + ' ' + values.family_name}/>
        </div>
    );
};

DashboardAuthorAvatar.propTypes = {
    values: PropTypes.shape({
        uqr_id: PropTypes.any,
        title: PropTypes.string,
        familyName: PropTypes.string,
        givenName: PropTypes.string
    })
};

export default DashboardAuthorAvatar;
