import React from 'react';
import { LookupListEditor } from 'modules/SharedComponents/Toolbox/ListEditor';
import { FieldOfResearchField, FilteredFieldOfResearchField } from './FieldOfResearchField';

export const FieldOfResearchListField = fieldProps => {
    return (
        <LookupListEditor
            listEditorId="field-of-research"
            inputField={FieldOfResearchField}
            error={!!fieldProps.state?.error}
            errorText={fieldProps.state.error}
            {...fieldProps}
        />
    );
};

export const FilteredFieldOfResearchListField = fieldProps => {
    return (
        <LookupListEditor
            listEditorId="filtered-field-of-research"
            inputField={FilteredFieldOfResearchField}
            error={!!fieldProps.state?.error}
            errorText={fieldProps.state.error}
            {...fieldProps}
        />
    );
};
