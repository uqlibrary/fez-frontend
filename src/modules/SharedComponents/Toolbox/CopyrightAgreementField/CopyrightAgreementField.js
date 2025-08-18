import React from 'react';
import CopyrightAgreement from './CopyrightAgreement';

export default function CopyrightAgreementField(fieldProps) {
    const isCopyrightAgreementAccepted = fieldProps.value === 'on' || fieldProps.value === 'on';
    return <CopyrightAgreement isCopyrightAgreementAccepted={isCopyrightAgreementAccepted} {...fieldProps} />;
}
