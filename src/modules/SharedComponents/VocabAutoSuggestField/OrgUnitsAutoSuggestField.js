import React from 'react';
import VocabAutoSuggestField from './components/VocabAutoSuggestField';
import {OrgUnitsVocabId} from 'config/general';

export default function OrgUnitsAutoSuggestField(fieldProps) {
    return(
        <VocabAutoSuggestField
            vocabId={OrgUnitsVocabId}
            onChange={fieldProps.input.onChange}
            locale ={
                fieldLabel: 'School, department or centre as published',
                fieldHint: 'Start typing organisation unit name'
            }
            {...fieldProps} />
    );
}
