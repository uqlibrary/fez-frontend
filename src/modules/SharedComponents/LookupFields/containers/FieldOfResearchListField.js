import React from 'react';
import { LookupListEditor } from 'modules/SharedComponents/Toolbox/ListEditor';
import { FieldOfResearchField, FilteredFieldOfResearchField } from './FieldOfResearchField';

export const FieldOfResearchListField = fieldProps => {
    return (
        <LookupListEditor
            listEditorId="field-of-research"
            inputField={FieldOfResearchField}
            errorText={fieldProps.meta ? fieldProps.meta.error : null}
            onChange={fieldProps.input.onChange}
            {...fieldProps}
        />
    );
};

export const FilteredFieldOfResearchListField = fieldProps => {
    return (
        <LookupListEditor
            inputField={FilteredFieldOfResearchField}
            errorText={fieldProps.meta ? fieldProps.meta.error : null}
            onChange={fieldProps.input.onChange}
            {...fieldProps}
        />
    );
};
