import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';

const PubmedCentralLink = ({pubmedCentralId}) => {
    if (!pubmedCentralId) return (<span className="pubmedCentralLinkUrl empty"/>);
    const txt = locale.global.pubmedCentralLink;
    return (
        <ExternalLink
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
    pubmedCentralId: PropTypes.string
};

export default PubmedCentralLink;
