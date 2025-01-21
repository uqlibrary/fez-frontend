import React from 'react';
import { LookupListEditor } from '../../Toolbox/ListEditor';
import SustainableDevelopmentGoalField from './SustainableDevelopmentGoalField';

export const SustainableDevelopmentGoalListField = fieldProps => {
    return (
        <LookupListEditor
            hideReorder
            listEditorId="sustainable-development-goal"
            inputField={SustainableDevelopmentGoalField}
            error={!!fieldProps.meta.error}
            errorText={fieldProps.meta.error}
            onChange={fieldProps.input?.onChange}
            onAddItem={state => ({
                ...state,
                itemList: state.itemList.sort((a, b) =>
                    a.sdgCVOId === b.sdgCVOId ? a.key - b.key : a.sdgCVOId - b.sdgCVOId,
                ),
            })}
            {...fieldProps}
        />
    );
};
