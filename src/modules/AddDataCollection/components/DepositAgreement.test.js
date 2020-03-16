import React from 'react';
import DepositAgreement from './DepositAgreement';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        disabled: false,
        isDepositAgreementAccepted: false,
        onChange: jest.fn(),
        depositAgreement: 'test deposit agreement',
        ...testProps,
    };

    return rtlRender(<DepositAgreement {...props} />);
}

describe('Component DepositAgreement', () => {
    it('should render default view', () => {
        const { getByTestId } = setup();
        expect(getByTestId('deposit-agreement')).toBeInTheDocument();
        expect(getByTestId('deposit-agreement')).not.toHaveAttribute('checked');
    });

    it('should render checked if deposit agreement accepted', () => {
        const { getByTestId } = setup({ isDepositAgreementAccepted: true });
        expect(getByTestId('deposit-agreement')).toBeInTheDocument();
        expect(getByTestId('deposit-agreement')).toHaveAttribute('checked', '');
    });

    it('should call onChange with "on" to handle change', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({ onChange: testFn });
        expect(getByTestId('deposit-agreement')).toBeInTheDocument();

        fireEvent.click(getByTestId('deposit-agreement'));
        expect(testFn).toHaveBeenCalledWith('on');
    });

    it('should call onChange with "off" to handle change', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({ onChange: testFn, isDepositAgreementAccepted: true });
        expect(getByTestId('deposit-agreement')).toBeInTheDocument();

        fireEvent.click(getByTestId('deposit-agreement'));
        expect(testFn).toHaveBeenCalledWith('off');
    });
});
