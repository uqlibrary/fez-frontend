import React from 'react';
import RelatedServiceListEditor from './components/RelatedServiceListEditor';

export default function RelatedServiceEditorField(fieldProps) {
    return <RelatedServiceListEditor onChange={fieldProps.input?.onChange} {...fieldProps} />;
}
