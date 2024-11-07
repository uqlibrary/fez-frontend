import React from 'react';
import CopyrightAgreement from './CopyrightAgreement';

export default function CopyrightAgreementField(fieldProps) {
    return (
        <CopyrightAgreement
            onChange={fieldProps.input?.onChange}
            isCopyrightAgreementAccepted={fieldProps.input.value !== '' && fieldProps.input.value === 'on'}
            {...fieldProps}
        />
    );
}
