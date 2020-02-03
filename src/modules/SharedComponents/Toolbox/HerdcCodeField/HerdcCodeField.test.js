import HerdcCodeField from './HerdcCodeField';
import Immutable from 'immutable';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        ...testProps,
    };

    return getElement(HerdcCodeField, props, args);
}

describe('HerdcCodeField component', () => {
    it('should render default view', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with given field props', () => {
        const wrapper = setup({
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
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render immutable list as selected value with given field props', () => {
        const wrapper = setup({
            label: 'Test label',
            placeholder: 'Test placeholder',
            input: {
                value: Immutable.List(['One', 'Two']),
                onChange: jest.fn(),
            },
            meta: {
                error: 'Test error',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render when given a default value field props', () => {
        const wrapper = setup({
            label: 'Test label',
            placeholder: 'Test placeholder',
            defaultValue: 'afr',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render unknown value', () => {
        const wrapper = setup({
            input: {
                value: '999',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render a current value', () => {
        const wrapper = setup({
            input: {
                value: '454028',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render a deprecated value', () => {
        const wrapper = setup({
            input: {
                value: '450033',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
