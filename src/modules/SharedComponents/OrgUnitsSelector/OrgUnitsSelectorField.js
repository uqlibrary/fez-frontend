import React from 'react';
import OrgUnitForm from './components/OrgUnitForm';
import {OrgUnitsVocabId} from 'config/general';

export default function OrgUnitsSelectorField(fieldProps) {
    return(<OrgUnitForm vocabId={OrgUnitsVocabId} onChange={fieldProps.input.onChange} {...fieldProps} />);
}
