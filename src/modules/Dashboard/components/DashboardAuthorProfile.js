import React from 'react';
import PropTypes from 'prop-types';
import {HelpIcon} from 'uqlibrary-react-toolbox';
import {locale} from 'config';
import DashboardAuthorDetails from './DashboardAuthorDetails';
import DashboardArticleCount from './DashboardArticleCount';
import DashboardResearcherIds from './DashboardResearcherIds';
import DashboardAuthorAvatar from './DashboardAuthorAvatar';

const DashboardProfile = ({authorDetails, author}) => {
    const txt = locale.pages.dashboard.header;
    return (
        <div className="imageCover">
            {/* HELP */}
            <div className="is-pulled-right">
                <HelpIcon {...txt.help} />
            </div>
            {
                authorDetails &&
                <div className="columns userDetails is-gapless">
                    {/* Profile avatar */}
                    {
                        authorDetails.image_exists === 1 &&
                        <div className="column is-narrow authorAvatar">
                            <DashboardAuthorAvatar
                                values={{
                                    uqr_id: authorDetails.uqr_id || author.aut_id || '',
                                    title: authorDetails.title || author.aut_title || '',
                                    givenName: authorDetails.given_name || author.aut_fname || '',
                                    familyName: authorDetails.family_name || author.aut_lname || ''
                                }}/>
                        </div>
                    }
                    {/* Author Details/Name/Orgs/ResearcherIDs */}
                    <div className="column authorDetails">
                        <DashboardAuthorDetails
                            values={{
                                title: authorDetails.title || author.aut_title || '',
                                givenName: authorDetails.given_name || author.aut_fname || '',
                                familyName: authorDetails.family_name || author.aut_lname || '',
                                orgUnits: authorDetails.org_units,
                                positions: authorDetails.positions
                            }}
                        />
                        <DashboardResearcherIds
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
                    {
                        authorDetails.espace &&
                        <div className="column is-narrow is-hidden-tablet-only authorCount">
                            <DashboardArticleCount
                                values={{
                                    articleCount: authorDetails.espace.doc_count,
                                    articleFirstYear: authorDetails.espace.first_year,
                                    articleLastYear: authorDetails.espace.last_year,
                                }}/>
                        </div>
                    }
                </div>
            }
        </div>
    );
};

DashboardProfile.propTypes = {
    authorDetails: PropTypes.object,
    author: PropTypes.object
};

export default DashboardProfile;
