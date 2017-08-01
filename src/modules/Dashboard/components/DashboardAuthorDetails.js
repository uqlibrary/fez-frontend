import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';

import DashboardResearcherIDs from './DashboardResearcherIDs';

const DashboardAuthorDetails = ({authorDetails}) => {
    return (
        <div className="columns userDetails">
            <div className="column is-narrow">
                <div className="accountHeadshot">
                    <Avatar size={150}
                            style={{
                                backgroundImage: 'url("https://its-ss-uqresearchers.s3.amazonaws.com/photo/thumbnail_' + authorDetails.uqr_id + '.jpg"), url("/public/images/avatar.jpg")',
                                backgroundSize: 'cover, cover'
                            }}
                            backgroundColor="transparent"
                            aria-label={'Photograph of ' + authorDetails.title + ' ' + authorDetails.given_name + ' ' + authorDetails.family_name}
                            title={authorDetails.title + ' ' + authorDetails.given_name + ' ' + authorDetails.family_name}/>
                </div>
            </div>

            {/* Account Name/Positions/OrgUnits */}
            <div className="column is-narrow accountDetails">
                <div className="accountTitleName title is-3 color-reverse">
                    {authorDetails.title} {authorDetails.given_name} {authorDetails.family_name}
                </div>
                <div className="column is-paddingless is-marginless is-narrow">

                    {authorDetails.positions.map((item, index) => (
                        <div key={index} className="accountPositionOrg color-reverse">
                            <strong>{item}</strong>
                            {item.length > 0 ? ', ' : ''}
                            <span className="color-reverse">{authorDetails.org_units[index]}</span>
                        </div>
                    ))}

                </div>
                <DashboardResearcherIDs publonsId={authorDetails.publons_id}
                                        researcherId={authorDetails.researcher_id}
                                        scopusId={authorDetails.scopus_id}
                                        googleScholarId={authorDetails.google_scholar_id}
                                        orcidId={authorDetails.orcid_id}/>
            </div>
        </div>
    );
};

DashboardAuthorDetails.propTypes = {
    authorDetails: PropTypes.object.isRequired,
};

export default DashboardAuthorDetails;
