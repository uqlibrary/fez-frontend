import React from 'react';
import PropTypes from 'prop-types';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';

export const ExternalLabelsListField = ({ loadVocabularies, ...fieldProps } = {}) => {
    React.useEffect(() => {
        loadVocabularies?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <NewGenericSelectField
            error={!!fieldProps.meta.error}
            errorText={fieldProps.meta.error}
            onChange={fieldProps.input.onChange}
            multiple
            {...fieldProps}
        />
    );
};
ExternalLabelsListField.propTypes = {
    loadVocabularies: PropTypes.func,
};
