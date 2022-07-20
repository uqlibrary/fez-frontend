import React from 'react';
import PropTypes from 'prop-types';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';

export const TkLabelsListField = ({ loadVocabularies, ...fieldProps } = {}) => {
    React.useEffect(() => {
        loadVocabularies?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <NewGenericSelectField
            error={!!fieldProps.meta.error}
            errorText={fieldProps.meta.error}
            onChange={fieldProps.input.onChange}
            {...fieldProps}
        />
    );
};
TkLabelsListField.propTypes = {
    loadVocabularies: PropTypes.func,
};
