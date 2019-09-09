import React from 'react';
import ConfirmDiscardFormChanges from './ConfirmDiscardFormChanges';

function setup(testProps = {}) {
    const ComponentToWrap = () => <div />;
    const WrappedComponent = ConfirmDiscardFormChanges(ComponentToWrap);
    return getElement(WrappedComponent, testProps);
}

describe('ConfirmDiscardFormChanges', () => {
    it('should render wrapped component with default props', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.props()).toHaveProperty('dirty');
        expect(wrapper.props()).toHaveProperty('submitSucceeded');
    });

    it('should call componentWillUnmount', () => {
        const wrapper = setup();
        const componentWillUnmount = jest.spyOn(wrapper.instance(), 'componentWillUnmount');

        wrapper.unmount();

        expect(componentWillUnmount).toHaveBeenCalled();
    });

    it('should call function to prompt to discard form changes', () => {
        const wrapper = setup();
        const promptDiscardFormChanges = jest.spyOn(wrapper.instance(), 'promptDiscardFormChanges');
        wrapper.setProps({
            dirty: true,
            submitSucceeded: false,
        });
        wrapper.update();
        expect(promptDiscardFormChanges).toHaveBeenCalled();
    });

    it('should get confirmation locale', () => {
        const wrapper = setup();
        const getDiscardFormChangesConfirmationLocale = jest.spyOn(
            wrapper.instance(),
            'getDiscardFormChangesConfirmationLocale',
        );
        wrapper.setProps({
            dirty: true,
            submitSucceeded: false,
        });
        wrapper.update();
        window.onbeforeunload();
        expect(getDiscardFormChangesConfirmationLocale).toHaveBeenCalled();
    });

    it('should not get confirmation locale', () => {
        const wrapper = setup();
        wrapper.instance().promptDiscardFormChanges();
        expect(window.onbeforeunload).toBeFalsy();
    });
});
