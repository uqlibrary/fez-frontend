import { ScrollTop as ScrollTopClass } from './ScrollTop';
import ScrollTop from './ScrollTop';

function setup(testProps, isShallow = false, requiresStore = false, context = {}) {
    const props = {
        classes: {},
        ...testProps,
    };
    return getElement(ScrollTopClass, props, isShallow, requiresStore, context);
}

describe('Component ScrollTop', () => {
    it('should render component', () => {
        const wrapper = setup({ show: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render component', () => {
        const wrapper = setup({ show: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

function setupFull(testProps, isShallow = false, requiresStore = false, context = {}) {
    const props = {
        classes: {},
        ...testProps,
    };
    return getElement(ScrollTop, props, isShallow, requiresStore, context);
}

describe('Component ScrollTop', () => {
    it('should render component', () => {
        const wrapper = setupFull({ show: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render component', () => {
        const wrapper = setupFull({ show: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
