import React from 'react';
import CopyrightAgreement from './CopyrightAgreement';

export default function CopyrightAgreementField(fieldProps) {
    const isCopyrightAgreementAccepted = fieldProps.value === 'on' || fieldProps?.input?.value === 'on';
    return (
        <CopyrightAgreement
            onChange={fieldProps.onChange || fieldProps.input?.onChange}
            isCopyrightAgreementAccepted={isCopyrightAgreementAccepted}
            {...fieldProps}
        />
    );
}
