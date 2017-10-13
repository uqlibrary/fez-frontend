import React from 'react';
import OrgUnitForm from './components/OrgUnitForm';

export default function OrgUnitsSelectorField(fieldProps) {
    return(<OrgUnitForm onChange={fieldProps.input.onChange} {...fieldProps} />);
}
