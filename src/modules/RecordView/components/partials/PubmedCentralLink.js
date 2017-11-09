import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'config';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';

const PubmedCentralLink = ({pubmedCentralId}) => {
    if (!pubmedCentralId) return (<span className="pubmedCentralLinkUrl empty"/>);
    const txt = locale.global.pubmedCentralLink;
    return (
        <ExternalLink
            className="pubmedCentralLinkUrl"
            linkText={txt.prefix + pubmedCentralId}
            href={txt.externalUrl.replace('[id]', pubmedCentralId)}
            title={txt.ariaLabel}
            aria-label={txt.ariaLabel}
        />
    );
};

PubmedCentralLink.propTypes = {
    pubmedCentralId: PropTypes.string
};

export default PubmedCentralLink;
