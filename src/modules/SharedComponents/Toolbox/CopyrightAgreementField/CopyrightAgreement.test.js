import React from 'react';
import { CopyrightAgreement } from './CopyrightAgreement';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps) {
    const props = {
        disabled: false,
        isCopyrightAgreementAccepted: false,
        onChange: jest.fn(),
        copyrightAgreement: 'test deposit agreement',
        copyrightAgreementFieldId: 'test',
        classes: {
            label: '',
            error: '',
            accepted: '',
        },
        ...testProps,
    };

    return rtlRender(<CopyrightAgreement {...props} />);
}

describe('Component CopyrightAgreement', () => {
    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should render checked if deposit agreement accepted', () => {
        const { container } = setup({ isCopyrightAgreementAccepted: true });
        expect(container).toMatchSnapshot();
    });

    it('should call onChange to handle change with on', () => {
        const testFn = jest.fn();
        const { getByRole } = setup({ onChange: testFn });
        fireEvent.click(getByRole('checkbox', { name: 'test deposit agreement' }));
        expect(testFn).toHaveBeenCalledWith('on');
    });

    it('should call onChange to handle change with off', () => {
        const testFn = jest.fn();
        const { getByRole } = setup({ isCopyrightAgreementAccepted: true, onChange: testFn });
        fireEvent.click(getByRole('checkbox', { name: 'test deposit agreement' }));
        expect(testFn).toHaveBeenCalledWith('off');
    });
});
