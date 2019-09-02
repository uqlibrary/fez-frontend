import { NavigationPrompt } from './NavigationPrompt';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = { ...testProps };
    return getElement(NavigationPrompt, props, args);
}

describe('NavigationPrompt component', () => {
    it('should render', () => {
        const testFunction = jest.fn();
        const wrapper = setup(
            { when: true, history: { block: testFunction }, children: jest.fn() },
            { isShallow: false },
        );
        const smallWrapper = wrapper.find('NavigationPrompt');
        expect(toJson(smallWrapper)).toMatchSnapshot();
        expect(testFunction).toBeCalled();
    });

    it('should not', () => {
        const wrapper = setup({ when: false, history: { block: jest.fn() }, children: jest.fn() });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call componentWillUnmount and unblock method', () => {
        const unblockFn = jest.fn();
        const wrapper = setup({
            when: true,
            history: { block: jest.fn(() => unblockFn) },
            children: jest.fn(),
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        const componentWillUnmount = jest.spyOn(wrapper.instance(), 'componentWillUnmount');

        wrapper.unmount();
        expect(componentWillUnmount).toHaveBeenCalled();
        expect(unblockFn).toHaveBeenCalled();
    });

    it('should block navigation', () => {
        const wrapper = setup({
            when: true,
            history: { block: jest.fn() },
            children: jest.fn(),
        });

        const showConfirmationFn = jest.fn();
        wrapper.instance().confirmationBox = {
            showConfirmation: showConfirmationFn,
        };

        const result = wrapper.instance().blockNavigation('/test');

        expect(wrapper.state().nextLocation).toEqual('/test');
        expect(showConfirmationFn).toHaveBeenCalled();
        expect(result).toBeFalsy();
    });

    it('should not block navigation', () => {
        const wrapper = setup({
            when: false,
            history: { block: jest.fn() },
            children: jest.fn(),
        });
        const showConfirmationFn = jest.fn();
        wrapper.instance().confirmationBox = {
            showConfirmation: showConfirmationFn,
        };

        const result = wrapper.instance().blockNavigation('/test');

        expect(wrapper.state().nextLocation).toBeNull();
        expect(showConfirmationFn).not.toBeCalled();
        expect(result).toBeFalsy();
    });

    it('should cancel navigation to next location', () => {
        const wrapper = setup({
            when: true,
            history: { block: jest.fn() },
            children: jest.fn((setNavigationConfirmation, onConfirm, onCancel) => {
                return {
                    cancel: onCancel,
                };
            }),
        });

        wrapper.setState({
            nextLocation: '/test',
        });
        wrapper.props().children.cancel();
        expect(wrapper.state().nextLocation).toBeNull();
    });

    it('should navigation to next location on confirm', () => {
        const pushFn = jest.fn();

        const wrapper = setup({
            when: true,
            history: {
                block: jest.fn(unblock => {
                    return () => unblock({ pathname: '/test' });
                }),
                push: pushFn,
            },
            children: jest.fn((setNavigationConfirmation, onConfirm) => {
                return {
                    confirm: onConfirm,
                };
            }),
        });

        const showConfirmationFn = jest.fn();
        wrapper.instance().confirmationBox = {
            showConfirmation: showConfirmationFn,
        };

        wrapper.update();
        wrapper.props().children.confirm();
        expect(pushFn).toHaveBeenCalledWith('/test');
    });
});
