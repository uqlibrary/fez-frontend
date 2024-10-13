import React from 'react';
import DepositAgreement from './DepositAgreement';

export default function DepositAgreementField(fieldProps) {
    return (
        <DepositAgreement
            onChange={fieldProps.input?.onChange}
            isDepositAgreementAccepted={fieldProps.input.value !== '' && fieldProps.input.value === 'on'}
            {...fieldProps}
        />
    );
}
