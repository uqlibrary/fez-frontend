import React from 'react';
import PropTypes from 'prop-types';

import { TOP_LEVEL_SECURITY_POLICIES } from 'config/general';

export const PolicyDescription = ({ selectedPolicyKey, policyArray }) => {
    const policyDesc = policyArray.find(policy => policy.value === selectedPolicyKey);
    return policyDesc ? `${policyDesc.name} (${policyDesc.id})` : '';
};

PolicyDescription.propTypes = {
    selectedPolicyKey: PropTypes.number,
    policyArray: PropTypes.array,
};

PolicyDescription.defaultProps = {
    policyArray: TOP_LEVEL_SECURITY_POLICIES,
};

export default React.memo(PolicyDescription);
