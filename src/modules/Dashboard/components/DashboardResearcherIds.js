import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';

const DashboardResearcherIds = ({values}) => {
    const txt = locale.pages.dashboard.header.dashboardResearcherIds;
    return (
        <div className="columns researcherIds is-gapless">

            {values && Object.keys(values).map((item, index) => (
                <div key={index} className={'column is-narrow researchIdAvatar ' +  (values[item] ? 'ok' : 'error')}>
                    <a href={values[item] ? txt.linksPrefix[item] + values[item] : 'https://app.library.uq.edu.au/#/id'}
                        target="_blank"
                        aria-label={values[item] ? txt.researcherIsLinked.replace('[resource]', txt.titles[item]).replace('[id]', values[item]) : txt.researcherIsNotLinked.replace('[resource]', txt.titles[item])}>
                        <div title={values[item] ? txt.researcherIsLinked.replace('[resource]', txt.titles[item]).replace('[id]', values[item]) : txt.researcherIsNotLinked.replace('[resource]', txt.titles[item])}
                            className={'fez-icon ' + item + ' dashboard'} />
                    </a>
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
    })
};

export default DashboardResearcherIds;
