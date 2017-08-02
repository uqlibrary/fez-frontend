import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';

const profileFallbackImage = require('../../../../public/images/avatar.svg');

const DashboardAuthorAvatar = ({authorDetails}) => {
    return (
        <div className="authorAvatar">
                <Avatar size={150}
                        style={{
                            backgroundImage: `url("https://its-ss-uqresearchers.s3.amazonaws.com/photo/thumbnail_${authorDetails.uqr_id}.jpg"), url(${profileFallbackImage})`,
                            backgroundSize: 'cover, cover'
                        }}
                        backgroundColor="transparent"
                        aria-label={'Photograph of ' + authorDetails.title + ' ' + authorDetails.given_name + ' ' + authorDetails.family_name}
                        title={authorDetails.title + ' ' + authorDetails.given_name + ' ' + authorDetails.family_name}/>
            </div>
    );
};

DashboardAuthorAvatar.propTypes = {
    authorDetails: PropTypes.object.isRequired,
};

export default DashboardAuthorAvatar;
