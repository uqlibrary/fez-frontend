import React from 'react';
import FileUploadTermsAndConditions from './FileUploadTermsAndConditions';
import { rtlRender, fireEvent } from 'test-utils';

const getProps = (testProps = {}) => ({
    disabled: false,
    isTermsAndConditionsAccepted: false,
    onAcceptTermsAndConditions: jest.fn(),
    acceptTermsAndConditions: 'test terms and conditions',
    classes: {
        label: '',
        error: '',
        accepted: '',
    },
    ...testProps,
});

function setup(testProps = {}) {
    return rtlRender(<FileUploadTermsAndConditions {...getProps(testProps)} />);
}

describe('Component FileUploadTermsAndConditions', () => {
    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render checked if terms and conditions accepted', () => {
        const { container } = setup({ isTermsAndConditionsAccepted: true });
        expect(container).toMatchSnapshot();
    });

    it('should call onAcceptTermsAndConditions to handle change', () => {
        const testFn = jest.fn();
        const { getByRole } = setup({ onAcceptTermsAndConditions: testFn });
        fireEvent.click(getByRole('checkbox'));
        expect(testFn).toHaveBeenCalledWith(true);
    });
});
