import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';

const DoiCitationView = ({doi, hideDoiLink}) => {
    if (!doi) return (<span className="citationDOI empty"/>);
    const txt = locale.global.doiCitationLink;
    const doiLink = txt.externalUrl.replace('[id]', doi);
    return (
        <React.Fragment>
            {
                hideDoiLink &&
                <span><br/>{txt.prefix + doi}</span>
            }
            {
                !hideDoiLink &&
                <ExternalLink className="citationDoiLink" href={doiLink} title={txt.ariaLabel} aria-label={txt.ariaLabel}>
                    {txt.prefix + doi}
                </ExternalLink>
            }
        </React.Fragment>
    );
};

DoiCitationView.propTypes = {
    doi: PropTypes.string,
    hideDoiLink: PropTypes.bool
};

export default DoiCitationView;
