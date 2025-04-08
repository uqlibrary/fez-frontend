import React from 'react';
import HerdcStatusField from './HerdcStatusField';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return rtlRender(<HerdcStatusField {...props} />);
}

describe('HerdcStatusField component', () => {
    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render with given field props', () => {
        const { container } = setup({
            label: 'Test label',
            placeholder: 'Test placeholder',
            value: ['One', 'Two'],
            onChange: jest.fn(),
            meta: {
                error: 'Test error',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render immutable list as selected value with given field props', () => {
        const { container } = setup({
            label: 'Test label',
            placeholder: 'Test placeholder',
            value: ['One', 'Two'],
            onChange: jest.fn(),
            meta: {
                error: 'Test error',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render when given a default value field props', () => {
        const { container } = setup({
            label: 'Test label',
            placeholder: 'Test placeholder',
            defaultValue: 'afr',
        });
        expect(container).toMatchSnapshot();
    });
});
