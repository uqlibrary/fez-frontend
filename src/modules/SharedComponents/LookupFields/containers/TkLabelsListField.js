import React from 'react';
import PropTypes from 'prop-types';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';

export const TkLabelsListField = ({ loadVocabularies, ...fieldProps } = {}) => {
    return (
        <NewGenericSelectField
            error={!!fieldProps.meta.error}
            errorText={fieldProps.meta.error}
            onChange={fieldProps.input.onChange}
            loadItemsList={loadVocabularies}
            {...fieldProps}
        />
    );
};
TkLabelsListField.propTypes = {
    loadVocabularies: PropTypes.func,
    itemsList: PropTypes.array,
};
