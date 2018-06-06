import React from 'react';
import PropTypes from 'prop-types';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';
import {locale} from 'locale';
import {routes} from 'config';

const DashboardResearcherIds = ({values, authenticated, history}) => {
    const txt = locale.pages.dashboard.header.dashboardResearcherIds;
    const link = {
        linkedUrl: {
            publons: 'https://publons.com/author/',
            scopus: 'http://www.scopus.com/authid/detail.url?authorId=',
            researcher: 'http://www.researcherid.com/rid/',
            google_scholar: 'https://scholar.google.com.au/citations?user=',
            orcid: 'https://orcid.org/'
        },
        notLinkedUrl: {
            publons: 'http://guides.library.uq.edu.au/for-researchers/researcher-identifier/researcher-identifier',
            scopus: 'http://guides.library.uq.edu.au/for-researchers/researcher-identifier/researcher-identifier',
            researcher: 'http://guides.library.uq.edu.au/for-researchers/researcher-identifier/researcher-identifier',
            google_scholar: 'http://guides.library.uq.edu.au/for-researchers/researcher-identifier/researcher-identifier',
            // google_scholar: routes.pathConfig.authorIdentifiers.googleScholar.link,
            orcid: routes.pathConfig.authorIdentifiers.orcid.link
        }
    };
    const navigateToRoute = (event, item) => {
        history.push(link.notLinkedUrl[item]);
    };

    return (
        <div className="columns researcherIds is-gapless">

            {values && Object.keys(values).map((item, index) => (
                <div key={index} className={'column is-narrow researchIdAvatar ' +  (values[item] && authenticated[item] ? 'ok' : 'error')}>

                    {/* external URL's */}
                    {((values[item] && link.linkedUrl[item].indexOf('http') !== -1) || (!values[item] && link.notLinkedUrl[item].indexOf('http') !== -1)) &&
                    <ExternalLink openInNewIcon={false} className="researcherIDlink"
                        href={values[item] ? link.linkedUrl[item] + values[item] : link.notLinkedUrl[item]}
                        title={values[item] ? txt.researcherIsLinked.replace('[resource]', txt.titles[item]).replace('[id]', values[item]) : txt.researcherIsNotLinked.replace('[resource]', txt.titles[item])} >
                        <div title={!!values[item] ? (txt.researcherIsLinked.replace('[resource]', txt.titles[item]).replace('[id]', values[item])) : (txt.researcherIsNotLinked.replace('[resource]', txt.titles[item]))}
                            className={'fez-icon ' + item + ' dashboard'}/>
                    </ExternalLink>
                    }

                    {/* Internal URL's - will be non-linked ID's only */}
                    {!values[item] && link.notLinkedUrl[item].indexOf('http') === -1 &&
                        <a tabIndex="0" onClick={(event) => navigateToRoute(event, item)} onKeyPress={(event) => navigateToRoute(event, item)}
                            title={txt.researcherIsNotLinked.replace('[resource]', txt.titles[item])} >
                            <div title={txt.researcherIsNotLinked.replace('[resource]', txt.titles[item])}
                                className={'fez-icon ' + item + ' dashboard'}/>
                        </a>
                    }
                </div>)
            )}

            {values.orcid &&
            <div className="column is-narrow">
                &nbsp;
                <a
                    className="orcidLink"
                    href={txt.orcidUrlPrefix + values.orcid}
                    target="_blank"
                    aria-label={txt.orcidlinkLabel}
                    title={txt.orcidlinkLabel}
                    tabIndex="0"
                >
                    {txt.orcidLinkPrefix}{values.orcid}
                </a>
            </div>
            }
        </div>
    );
};

DashboardResearcherIds.propTypes = {
    values: PropTypes.shape({
        publons: PropTypes.string,
        researcher: PropTypes.string,
        scopus: PropTypes.string,
        google_scholar: PropTypes.string,
        orcid: PropTypes.string
    }),
    authenticated: PropTypes.shape({
        publons: PropTypes.bool,
        researcher: PropTypes.bool,
        scopus: PropTypes.bool,
        google_scholar: PropTypes.bool,
        orcid: PropTypes.bool
    }),
    history: PropTypes.object.isRequired
};

export default DashboardResearcherIds;
