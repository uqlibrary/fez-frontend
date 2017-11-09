import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'config';
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new';

const PmcidLink = ({pcmId}) => {
    if (!pcmId) return (<span className="LinkPMCID empty"/>);
    const txt = locale.global.PmcidLink;
    const pcmIdLink = txt.externalUrl.replace('[id]', pcmId);
    return (
        <span className="LinkPCMID">
            &nbsp;
            <a
                href={pcmIdLink}
                className="LinkPcmIdUrl"
                target="_blank"
                rel="noopener noreferrer"
                title={txt.ariaLabel} >
                <span className="LinkLabel">{txt.prefix}</span>
                <span className="LinkValue">
                    {pcmId}
                    <ActionOpenInNew className="LinkOpenPmcidUrlIcon"/>
                </span>
            </a>
        </span>
    );
};

PmcidLink.propTypes = {
    pcmId: PropTypes.string
};

export default PmcidLink;
