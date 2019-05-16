import {Page} from './StandardPage';
import StandardPage from './StandardPage';

function setup(testProps, isShallow = true) {
    const props = {...testProps, classes: {}};
    return getElement(Page, props, isShallow);
}

describe('Snapshot tests for StandardPage component', () => {
    it('renders StandardPage with title', () => {
        const wrapper = setup({title: 'standard page title'});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders StandardPage without a title', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders StandardPage with help', () => {
        const wrapper = setup({title: 'Test', children: 'Test', help: {title: 'Test', text: 'Test', buttonLabel:'Test'}});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

});

function setup2(testProps, isShallow = false) {
    const props = {...testProps, classes: {}};
    return getElement(StandardPage, props, isShallow);
}

describe('Snapshot tests for full mount StandardPage component', () => {

    it('renders StandardPage with title and  help and content', () => {
        const wrapper = setup2({title: 'Test', children: 'Test', help: {title: 'Test', text: 'Test', buttonLabel:'Test'}}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});

