import React from 'react';
import PropTypes from 'prop-types';
import DashboardAuthorDetails from './DashboardAuthorDetails';
import DashboardArticleCount from './DashboardArticleCount';
import DashboardResearcherIDs from './DashboardResearcherIDs';
import DashboardAuthorAvatar from './DashboardAuthorAvatar';

const DashboardProfile = ({authorDetails}) => {
    return (
        <div className="imageCover">
            <div className="columns userDetails is-gapless">

                {/* Profile avatar */}
                <div className="column is-narrow authorAvatar">
                    <DashboardAuthorAvatar authorDetails={authorDetails}/>
                </div>

                {/* Author Details/Name/Orgs/ResearcherIDs */}
                <div className="column authorDetails">
                    <DashboardAuthorDetails title={authorDetails.title}
                                            givenName={authorDetails.given_name}
                                            familyName={authorDetails.family_name}
                                            orgUnits={authorDetails.org_units}
                                            positions={authorDetails.positions} />
                    <DashboardResearcherIDs
                        values={{
                            publons: authorDetails.publons_id,
                            researcher: authorDetails.researcher_id,
                            scopus: authorDetails.scopus_id,
                            google_scholar: authorDetails.google_scholar_id,
                            orcid: authorDetails.orcid_id
                        }}
                    />
                </div>

                {/* Publication count */}
                <div className="column is-narrow authorCount">
                    <DashboardArticleCount articleCount={authorDetails.espace.doc_count}
                                           articleFirstYear={authorDetails.espace.first_year}
                                           articleLastYear={authorDetails.espace.last_year} />
                </div>
            </div>
        </div>
    );
};

DashboardProfile.propTypes = {
    authorDetails: PropTypes.object.isRequired
};

export default DashboardProfile;
