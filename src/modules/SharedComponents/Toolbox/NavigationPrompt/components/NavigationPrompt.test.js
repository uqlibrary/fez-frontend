import {NavigationPrompt} from './NavigationPrompt';

function setup(testProps, isShallow = true) {
    const props = {...testProps};
    return getElement(NavigationPrompt, props, isShallow);
}

describe('NavigationPrompt component', () => {
    it('should render', () => {
        const testFunction = jest.fn();

        const history = {
            block: testFunction
        };

        const wrapper = setup({when: true, history: history, children: jest.fn()}, false);
        const smallWrapper = wrapper.find('NavigationPrompt');
        expect(toJson(smallWrapper)).toMatchSnapshot();
        expect(testFunction).toBeCalled();
    });

    it('should not', () => {
        const wrapper = setup({when: false, history: {block: jest.fn()}, children: jest.fn()});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
