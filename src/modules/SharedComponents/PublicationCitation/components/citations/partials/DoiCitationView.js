import React from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { getDoiURL } from 'helpers/general';

const DoiCitationView = ({ doi, hideDoiLink }) => {
    if (!doi) return <span className="citationDOI empty" />;
    const txt = locale.global.doiCitationLink;
    const link = getDoiURL(doi);
    return (
        <span data-testid="rek-doi">
            {hideDoiLink && (
                <span>
                    <br />
                    {link}
                </span>
            )}
            {!hideDoiLink && (
                <ExternalLink
                    id="citation-doi"
                    className="citationDoiLink"
                    href={link}
                    title={txt.ariaLabel}
                    aria-label={txt.ariaLabel}
                >
                    {link}
                </ExternalLink>
            )}
        </span>
    );
};

DoiCitationView.propTypes = {
    doi: PropTypes.string,
    hideDoiLink: PropTypes.bool,
};

export default React.memo(DoiCitationView);
