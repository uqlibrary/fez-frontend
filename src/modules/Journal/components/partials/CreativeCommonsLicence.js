import React from 'react';
import PropTypes from 'prop-types';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

import { CREATIVE_COMMONS_LICENCES, getCreativeCommonsUrl } from 'config/general';

const CreativeCommonsLicence = ({ by, nd, nc, sa }) => {
    // Note: the order of conditions is important; don't change.
    const conditions = [];
    by && conditions.push('by');
    nd && conditions.push('nd');
    nc && conditions.push('nc');
    sa && conditions.push('sa');
    const licence = conditions.join('-');
    const testId = 'journal-oa-licence';

    return (
        <ExternalLink href={getCreativeCommonsUrl(licence)} id={testId} data-testid={testId}>
            <div data-testid={`${testId}-lookup`} style={{ paddingRight: '1rem' }}>
                {CREATIVE_COMMONS_LICENCES[licence]}
            </div>
            <div className={`fez-icon license cc-${licence}`} />
        </ExternalLink>
    );
};

CreativeCommonsLicence.propTypes = {
    by: PropTypes.bool,
    nd: PropTypes.bool,
    nc: PropTypes.bool,
    sa: PropTypes.bool,
};

export default CreativeCommonsLicence;
