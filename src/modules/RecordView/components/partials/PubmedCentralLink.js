import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'config';
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new';

const PubmedCentralLink = ({pubmedCentralId}) => {
    if (!pubmedCentralId) return (<span className="pubmedCentralLink empty"/>);
    const txt = locale.global.PubmedCentralLink;
    const pubmedCentralIdLink = txt.externalUrl.replace('[id]', pubmedCentralId);
    return (
        <a
            href={pubmedCentralIdLink}
            className="pubmedCentralLink"
            target="_blank"
            rel="noopener noreferrer"
            title={txt.ariaLabel} >
            <span className="linkValue">
                {txt.prefix}{pubmedCentralId}
                <ActionOpenInNew className="openPubmedCentralLinkIcon"/>
            </span>
        </a>
    );
};

PubmedCentralLink.propTypes = {
    pubmedCentralId: PropTypes.string
};

export default PubmedCentralLink;
