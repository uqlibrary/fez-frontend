import DoiCitationView from './DoiCitationView';
import {researchReport} from 'mock/data/testing/records';

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    const props = {
        classes: {},
        ...testProps
    };
    return getElement(DoiCitationView, props, isShallow);
}

describe('DoiCitationView test ', () => {
    it('should render component with empty span', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with doi', () => {
        const wrapper = setup({doi: '10.121212/lskdjflsdjf'}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
