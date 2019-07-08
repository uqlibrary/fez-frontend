import { dataCollection } from 'mock/data/testing/records';
import AvailableVersions from './AvailableVersions';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        publication: testProps.publication || dataCollection,
        title: testProps.title || '',
    };
    return getElement(AvailableVersions, props, isShallow);
}

describe('Available Versions Component ', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        // expect(wrapper.find('.availableVersions li').length).toEqual(2);
    });
});
