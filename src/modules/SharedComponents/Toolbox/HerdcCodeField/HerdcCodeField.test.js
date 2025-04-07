import React from 'react';
import HerdcCodeField from './HerdcCodeField';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return rtlRender(<HerdcCodeField {...props} />);
}

describe('HerdcCodeField component', () => {
    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render with given field props', () => {
        const { container } = setup({
            label: 'Test label',
            placeholder: 'Test placeholder',
            input: {
                value: ['One', 'Two'],
                onChange: jest.fn(),
            },
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
            input: {
                value: ['One', 'Two'],
                onChange: jest.fn(),
            },
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

    it('should not render unknown value', () => {
        const { container } = setup({
            input: {
                value: '999',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render a current value', () => {
        const { container } = setup({
            input: {
                value: '454028',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render a deprecated value', () => {
        const { container } = setup({
            input: {
                value: '450033',
            },
        });
        expect(container).toMatchSnapshot();
    });
});
