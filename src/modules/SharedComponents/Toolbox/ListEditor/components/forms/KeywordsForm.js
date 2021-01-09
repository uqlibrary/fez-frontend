import React from 'react';
import PropTypes from 'prop-types';
import { FreeTextForm } from '../FreeTextForm';

import { validation } from 'config';

export const KeywordsForm = props => {
    const { onSubmit } = props;
    const handleSubmit = React.useCallback(item => onSubmit(item[0].split('|').filter(token => token.trim() !== '')), [
        onSubmit,
    ]);
    return <FreeTextForm {...props} isValid={validation.isValidKeyword(111)} onSubmit={handleSubmit} />;
};

KeywordsForm.propTypes = {
    onSubmit: PropTypes.func,
};

export default React.memo(KeywordsForm);
