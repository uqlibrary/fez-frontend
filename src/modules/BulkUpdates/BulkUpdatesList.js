import React from 'react';

import PropTypes from 'prop-types';

export const BulkUpdatesList = ({ list }) => {
    console.log(list);
    return <div id="bulk-updates-list" data-testid="bulk-updates-list" />;
};

BulkUpdatesList.propTypes = {
    list: PropTypes.array,
};

export default React.memo(BulkUpdatesList);
