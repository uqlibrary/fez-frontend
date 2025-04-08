import React from 'react';
import DepositAgreementField from './DepositAgreementField';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        disabled: false,
        isDepositAgreementAccepted: false,
        depositAgreementFieldId: 'rek-copyright',
        onChange: jest.fn(),
        depositAgreement: 'test deposit agreement',
        ...testProps,
    };

    return rtlRender(<DepositAgreementField {...props} />);
}

describe('Component DepositAgreementField', () => {
    it('should render default view', () => {
        const { getByTestId } = setup();
        expect(getByTestId('rek-copyright-input')).toBeInTheDocument();
        expect(getByTestId('rek-copyright-input')).not.toHaveAttribute('checked');
    });

    it('should render checked if deposit agreement accepted', () => {
        const { getByTestId } = setup({ isDepositAgreementAccepted: true });
        expect(getByTestId('rek-copyright-input')).toBeInTheDocument();
        expect(getByTestId('rek-copyright-input')).toHaveAttribute('checked', '');
    });

    it('should call onChange with "on" to handle change', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({ onChange: testFn });
        expect(getByTestId('rek-copyright-input')).toBeInTheDocument();

        fireEvent.click(getByTestId('rek-copyright-input'));
        expect(testFn).toHaveBeenCalledWith('on');
    });

    it('should call onChange with "off" to handle change', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({ onChange: testFn, isDepositAgreementAccepted: true });
        expect(getByTestId('rek-copyright-input')).toBeInTheDocument();

        fireEvent.click(getByTestId('rek-copyright-input'));
        expect(testFn).toHaveBeenCalledWith('off');
    });
});
