import React from 'react';
import CopyrightAgreementField from './CopyrightAgreementField';
import { rtlRender } from 'test-utils';

function setup(testProps) {
    const props = {
        disabled: false,
        isCopyrightAgreementAccepted: false,
        input: {
            onChange: jest.fn(),
        },
        copyrightAgreementFieldId: 'test',
        copyrightAgreement: 'test deposit agreement',
        classes: {
            label: '',
            error: '',
            accepted: '',
        },
        ...testProps,
    };

    return rtlRender(<CopyrightAgreementField {...props} />);
}

describe('Component CopyrightAgreement', () => {
    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
});
