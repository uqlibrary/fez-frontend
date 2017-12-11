import React from 'react';
import PropTypes from 'prop-types';
import {authorIdentifierLinks} from 'config/general';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';
import {locale} from 'locale';

const DashboardResearcherIds = ({values, history}) => {
    const txt = locale.pages.dashboard.header.dashboardResearcherIds;
    const link = authorIdentifierLinks;
    const navigateToRoute = (event, item) => {
        history.push(link.notLinkedUrl[item]);
    };
    return (
        <div className="columns researcherIds is-gapless">

            {values && Object.keys(values).map((item, index) => (
                <div key={index} className={'column is-narrow researchIdAvatar ' +  (values[item] ? 'ok' : 'error')}>

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
                        <a onClick={(event) => navigateToRoute(event, item)} onKeyPress={(event) => navigateToRoute(event, item)}
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
                    title={txt.orcidlinkLabel}>
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
    history: PropTypes.object.isRequired
};

export default DashboardResearcherIds;
