import React from 'react';
import OrgAffiliationTypeSelector from './OrgAffiliationTypeSelector';
import { AFFILIATION_TYPE_NOT_UQ, AFFILIATION_TYPE_UQ } from 'config/general';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        affiliation: '',
        onAffiliationChange: jest.fn(),
        locale: {
            inputLabel: 'Org affiliation',
            placeholder: 'Organisational affiliation at time of publication',
            options: [
                { key: AFFILIATION_TYPE_UQ, value: 'UQ' },
                { key: AFFILIATION_TYPE_NOT_UQ, value: 'Not UQ' },
            ],
        },
        ...testProps,
    };
    return rtlRender(<OrgAffiliationTypeSelector {...props} />);
}

describe('OrgAffiliationTypeSelector tests ', () => {
    it('should render component with default values', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render component with UQ selected', () => {
        const { container } = setup({ affiliation: AFFILIATION_TYPE_UQ });
        expect(container).toMatchSnapshot();
    });

    it('should render component with Not UQ selected', () => {
        const { container } = setup({ affiliation: AFFILIATION_TYPE_NOT_UQ });
        expect(container).toMatchSnapshot();
    });
});
