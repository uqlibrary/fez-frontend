import React from 'react';
import PropTypes from 'prop-types';
import { FreeTextForm } from '../FreeTextForm';

import { validation } from 'config';

export const KeywordsForm = props => {
    const { onSubmit, mode } = props;
    const handleSubmit = React.useCallback(
        (item, indexFinder) =>
            onSubmit(mode === 'add' ? item[0].split('|').filter(token => token.trim() !== '') : item, indexFinder),
        [onSubmit, mode],
    );
    return <FreeTextForm {...props} isValid={validation.isValidKeyword(111)} onSubmit={handleSubmit} />;
};

KeywordsForm.propTypes = {
    mode: PropTypes.string,
    onSubmit: PropTypes.func,
};

export default React.memo(KeywordsForm);
