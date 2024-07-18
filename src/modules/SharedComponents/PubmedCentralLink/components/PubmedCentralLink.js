import React from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

export const PubmedCentralLink = ({ pubmedCentralId }) => {
    const txt = locale.global.pubmedCentralLink;
    if (!pubmedCentralId) {
        return <div className="pubmedCentralLinkUrl empty" />;
    }
    return (
        <ExternalLink
            id="pubmed-central"
            className="pubmedCentralLinkUrl"
            href={txt.externalUrl.replace('[id]', pubmedCentralId)}
            title={txt.ariaLabel}
            aria-label={txt.ariaLabel}
        >
            {txt.prefix + pubmedCentralId}
        </ExternalLink>
    );
};
PubmedCentralLink.propTypes = {
    pubmedCentralId: PropTypes.string,
};
export default React.memo(PubmedCentralLink);
