import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'config';
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new';

const DoiCitationView = ({doi}) => {
    if (!doi) return (<span className="citationDOI empty"/>);
    const txt = locale.global.doiCitationLink;
    const doiLink = txt.externalUrl.replace('[id]', doi);
    return (
        <span className="citationDOI">
            &nbsp;
            <a href={doiLink}
                className="citationDoiLink"
                target="_blank"
                rel="noopener noreferrer"
                title={txt.ariaLabel} >
                <span className="citationLabel">{txt.prefix}</span>
                <span className="citationValue">
                    {doi}
                    <ActionOpenInNew className="citationOpenUrlIcon"/>
                </span>
            </a>
        </span>
    );
};

DoiCitationView.propTypes = {
    doi: PropTypes.string
};

export default DoiCitationView;
