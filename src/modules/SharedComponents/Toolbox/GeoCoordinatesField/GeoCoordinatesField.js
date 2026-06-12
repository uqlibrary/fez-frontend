import React from 'react';
import PublicationMap from '../../PublicationMap/PublicationMap';
import { withErrorBoundary } from '../../../../helpers/general';

export default fieldProps => withErrorBoundary(<PublicationMap coordinates={fieldProps.value || ''} {...fieldProps} />);
