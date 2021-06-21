import React from 'react';
import PropTypes from 'prop-types';

import ViewField from './ViewField';

export const ViewRow = ({ fields }) => {
    return fields.map(field => <ViewField key={`journal-details-field-${field.fieldId}`} fieldConfig={field} />);
};

ViewRow.propTypes = {
    fields: PropTypes.array,
};

export default React.memo(ViewRow);
