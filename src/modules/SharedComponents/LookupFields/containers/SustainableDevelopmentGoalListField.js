import React from 'react';
import { LookupListEditor } from '../../Toolbox/ListEditor';
import SustainableDevelopmentGoalField from './SustainableDevelopmentGoalField';

const sortSDGFlatTree = (a, b) => {
    if (a.sdgCVOId === b.sdgCVOId) {
        return a.key - b.key;
    }
    return a.sdgCVOId - b.sdgCVOId;
};

export const SustainableDevelopmentGoalListField = fieldProps => {
    return (
        <LookupListEditor
            hideReorder
            listEditorId="sustainable-development-goal"
            inputField={SustainableDevelopmentGoalField}
            onAddItem={state => ({ ...state, itemList: state.itemList.sort(sortSDGFlatTree) })}
            {...fieldProps}
        />
    );
};
