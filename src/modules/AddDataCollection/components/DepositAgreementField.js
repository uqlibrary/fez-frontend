import React from 'react';
import DepositAgreement from './DepositAgreement';

export default function DepositAgreementField(fieldProps) {
    return (
        <DepositAgreement
            isDepositAgreementAccepted={fieldProps.value !== '' && fieldProps.value === 'on'}
            {...fieldProps}
        />
    );
}
