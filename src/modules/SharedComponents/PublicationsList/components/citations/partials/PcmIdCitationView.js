import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'config';
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new';

const PcmIdCitationView = ({pcmId}) => {
    if (!pcmId) return (<span className="citationPCMID empty"/>);
    const txt = locale.global.pcmIdCitationLink;
    const pcmIdLink = txt.externalUrl.replace('[id]', pcmId);
    return (
        <span className="citationPCMID">
            &nbsp;
            <a
                href={pcmIdLink}
                className="citationPcmIdLink"
                target="_blank"
                rel="noopener noreferrer"
                title={txt.ariaLabel} >
                <span className="citationLabel">{txt.prefix}</span>
                <span className="citationValue">
                    {pcmId}
                    <ActionOpenInNew className="citationOpenUrlIcon"/>
                </span>
            </a>
        </span>
    );
};

PcmIdCitationView.propTypes = {
    pcmId: PropTypes.string
};

export default PcmIdCitationView;
