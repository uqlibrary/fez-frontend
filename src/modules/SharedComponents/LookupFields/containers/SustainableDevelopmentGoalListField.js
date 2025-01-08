import React from 'react';
import { LookupListEditor } from '../../Toolbox/ListEditor';
import { SustainableDevelopmentGoalField } from './SustainableDevelopmentGoalField';

export const SustainableDevelopmentGoalListField = fieldProps => {
    return (
        <LookupListEditor
            listEditorId="sustainable-development-goal"
            inputField={SustainableDevelopmentGoalField}
            error={!!fieldProps.meta.error}
            errorText={fieldProps.meta.error}
            onChange={fieldProps.input?.onChange}
            {...fieldProps}
        />
    );
};
