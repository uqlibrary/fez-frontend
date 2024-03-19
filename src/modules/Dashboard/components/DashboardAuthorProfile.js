import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import DashboardAuthorDetails from './DashboardAuthorDetails';
import DashboardArticleCount from '../containers/DashboardArticleCount';
import DashboardResearcherIds from './DashboardResearcherIds';
import DashboardAuthorAvatar from './DashboardAuthorAvatar';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

const background = require('../../../../public/images/dashboard_cover.jpg');

const StyledCard = styled(Card)({
    backgroundImage: 'url(' + background + ')',
    backgroundSize: 'cover',
    padding: 16,
});

export const DashboardAuthorProfile = ({ author, authorDetails, history }) => {
    if (!authorDetails) {
        return <div className="AuthorProfile empty" />;
    }

    return (
        <StyledCard>
            <Grid container spacing={3} alignContent={'center'} alignItems={'center'} justifyContent={'center'}>
                {/* Profile avatar */}
                {authorDetails.image_exists === 1 && (
                    <Grid item xs={'auto'}>
                        <DashboardAuthorAvatar
                            values={{
                                uqr_id: authorDetails.uqr_id || author.aut_id || '',
                                title: author.aut_title || '',
                                givenName: author.aut_fname || '',
                                familyName: author.aut_lname || '',
                            }}
                        />
                    </Grid>
                )}
                {/* Author Details/Name/Orgs/ResearcherIDs */}
                <Grid item xs>
                    <Grid container>
                        <Grid item xs={12}>
                            <DashboardAuthorDetails
                                {...{
                                    title: author.aut_title || '',
                                    givenName: author.aut_fname || '',
                                    familyName: author.aut_lname || '',
                                    orgUnits: authorDetails.org_units,
                                    positions: authorDetails.positions,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <DashboardResearcherIds
                                values={{
                                    researcher: author.aut_researcher_id,
                                    scopus:
                                        parseInt(author.aut_is_scopus_id_authenticated, 10) === 1
                                            ? author.aut_scopus_id
                                            : '',
                                    google_scholar: author.aut_google_scholar_id,
                                    orcid: author.aut_orcid_id,
                                }}
                                authenticated={{
                                    researcher: Boolean(author.aut_researcher_id),
                                    scopus: Boolean(author.aut_is_scopus_id_authenticated),
                                    google_scholar: Boolean(author.aut_google_scholar_id),
                                    orcid: Boolean(author.aut_orcid_id),
                                }}
                                history={history}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                {/* Publication count */}
                <Grid item xs={'auto'} sx={{ display: { xs: 'none', md: 'block' } }}>
                    <DashboardArticleCount />
                </Grid>
            </Grid>
        </StyledCard>
    );
};
DashboardAuthorProfile.propTypes = {
    author: PropTypes.object,
    authorDetails: PropTypes.object,
    history: PropTypes.object.isRequired,
};

export default DashboardAuthorProfile;
