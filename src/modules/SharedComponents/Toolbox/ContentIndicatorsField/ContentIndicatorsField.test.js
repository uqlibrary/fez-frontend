import ContentIndicatorsField from './ContentIndicatorsField';
import Immutable from 'immutable';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps
    };

    return getElement(ContentIndicatorsField, props, isShallow);
}

describe('ContentIndicatorsField component', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with given field props', () => {
        const wrapper = setup({
            label: 'Test label',
            placeholder: 'Test placeholder',
            input: {
                value: [
                    454057,
                    454058
                ],
                onChange: jest.fn()
            },
            meta: {
                error: 'Test error'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setProps({
            input: {
                value: Immutable.List([454057, 454058])
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
