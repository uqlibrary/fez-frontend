import React from 'react';
import PropTypes from 'prop-types';

import {TOP_LEVEL_SECURITY_POLICIES} from 'config/general';

export const PolicyDescription = React.memo(({selectedPolicyKey, policyArray}) => {
    const policyDesc = policyArray.find(
        policy => policy.value === selectedPolicyKey
    );
    return (
        <React.Fragment>
            {policyDesc.name} ({policyDesc.id})
        </React.Fragment>
    );
});

PolicyDescription.propTypes = {
    selectedPolicyKey: PropTypes.number,
    policyArray: PropTypes.array
};

PolicyDescription.defaultProps = {
    policyArray: TOP_LEVEL_SECURITY_POLICIES
};
