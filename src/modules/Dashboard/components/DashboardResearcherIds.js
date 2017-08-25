import React from 'react';
import Avatar from 'material-ui/Avatar';
import PropTypes from 'prop-types';
import {locale} from 'config';

const DashboardResearcherIds = ({values}) => {
    const txt = locale.pages.dashboard.header.dashboardResearcherIds;
    return (
        <div className="columns researcherIds is-gapless">
            {values && Object.keys(values).map((item, index) => (
                <div key={index} className={`${item} column is-narrow`}>
                    <a
                        href="https://app.library.uq.edu.au/#/id"
                        target="_blank"
                        aria-label={values[item] ? txt.researcherIsLinked.replace('[resource]', item).replace('[id]', values[item]) : txt.researcherIsNotLinked.replace('[resource]', item)}>
                        <Avatar
                            className={values[item] ? (`${item.toLowerCase()} researchIdAvatar ok`) : (`${item.toLowerCase()} researchIdAvatar error`)}
                            src={require(`../../../../src/images/${item.toLowerCase()}_icon.svg`)}
                            title={values[item] ? txt.researcherIsLinked.replace('[resource]', item).replace('[id]', values[item]) : txt.researcherIsNotLinked.replace('[resource]', item)}
                            alt={values[item] ? txt.researcherIsLinked.replace('[resource]', item).replace('[id]', values[item]) : txt.researcherIsNotLinked.replace('[resource]', item)}/>
                    </a>
                </div>)
            )}

            {values.orcid &&
            <div className="column is-narrow">
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
