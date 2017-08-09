import React from 'react';
import PropTypes from 'prop-types';
import {HelpIcon} from 'uqlibrary-react-toolbox';
import {locale} from 'config';
import DashboardAuthorDetails from './DashboardAuthorDetails';
import DashboardArticleCount from './DashboardArticleCount';
import DashboardResearcherIds from './DashboardResearcherIds';
import DashboardAuthorAvatar from './DashboardAuthorAvatar';

const DashboardProfile = ({authorDetails}) => {
    const txt = locale.components.dashboard;
    return (
        <div className="imageCover">
            {/* HELP */}
            <div className="is-pulled-right" >
                <HelpIcon
                    title={txt.help.title}
                    text={txt.help.text}
                    buttonLabel={txt.help.button}
                />
            </div>
            {authorDetails && (
                <div className="columns userDetails is-gapless">

                    {/* Profile avatar */}
                    {authorDetails.image_exists === 1 && (
                        <div className="column is-narrow authorAvatar">
                            <DashboardAuthorAvatar
                                values={{
                                    uqr_id: authorDetails.uqr_id,
                                    title: authorDetails.title,
                                    givenName: authorDetails.given_name,
                                    familyName: authorDetails.family_name,
                                }} />
                        </div>
                    )}
                    {/* Author Details/Name/Orgs/ResearcherIDs */}
                    <div className="column authorDetails">
                        <DashboardAuthorDetails
                            values={{
                                title: authorDetails.title,
                                givenName: authorDetails.given_name,
                                familyName: authorDetails.family_name,
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
                    <div className="column is-narrow is-hidden-tablet-only authorCount">
                        <DashboardArticleCount
                            values={{
                                articleCount: authorDetails.espace.doc_count,
                                articleFirstYear: authorDetails.espace.first_year,
                                articleLastYear: authorDetails.espace.last_year,
                            }}/>
                    </div>
                </div>
            )}
        </div>
    );
};

DashboardProfile.propTypes = {
    authorDetails: PropTypes.object
};

export default DashboardProfile;
