jest.dontMock('./ThesisHdrRedirect');

import ThesisHdrRedirect from './ThesisHdrRedirect';
import { routes } from 'config';

function setup(testProps = {}) {
    const props = {
        history: {
            push: jest.fn(),
            go: jest.fn(),
        },
        ...testProps,
    };
    return getElement(ThesisHdrRedirect, props);
}

describe('ThesisHdrRedirect ', () => {
    it('should render component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with 0 input fields', () => {
        const wrapper = setup();
        expect(wrapper.find('Field').length).toEqual(0);
    });

    it('should redirect to Thesis submission page', () => {
        const pushFn = jest.fn();
        const wrapper = setup({
            history: {
                push: pushFn,
            },
        });

        wrapper.instance()._handleAction();

        expect(pushFn).toHaveBeenCalledWith(routes.pathConfig.hdrSubmission);
    });
});
