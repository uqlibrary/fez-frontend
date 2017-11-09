import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'config';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';

const DoiCitationView = ({doi}) => {
    if (!doi) return (<span className="citationDOI empty"/>);
    const txt = locale.global.doiCitationLink;
    const doiLink = txt.externalUrl.replace('[id]', doi);
    return (
        <span className="citationDOI">
            &nbsp;
            <ExternalLink className="citationDoiLink" linkUrl={doiLink} linkTooltip={txt.ariaLabel}>
                <span className="citationLabel">{txt.prefix}</span>
                <span className="citationValue">{doi}</span>
            </ExternalLink>
        </span>
    );
};

DoiCitationView.propTypes = {
    doi: PropTypes.string
};

export default DoiCitationView;
