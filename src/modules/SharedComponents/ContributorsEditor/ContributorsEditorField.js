/* eslint-disable react/prop-types */
import React from 'react';
import ContributorsEditor from './components/ContributorsEditor';

export default function ContributorsEditorField(fieldProps) {
    if (
        !fieldProps.value ||
        (!!fieldProps.input.value && !!fieldProps.input.value?.toJS && !!fieldProps.input.value.toJS())
    ) {
        return <></>;
    }

    return <ContributorsEditor onChange={fieldProps.input?.onChange} {...fieldProps} />;
}
