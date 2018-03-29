jest.dontMock('./DashboardAuthorProfile');

import DashboardAuthorProfile from './DashboardAuthorProfile';
import * as mock from 'mock/data';

function setup(testProps, isShallow = true) {
    const props = {
        authorDetails: mock.authorDetails.uqresearcher,
        author: mock.currentAuthor.uqresearcher.data,
        history: {},
        ...testProps
    };
    return getElement(DashboardAuthorProfile, props, isShallow);
}

describe('Dashboard Author Profile test', () => {
    it('Render the authors profile as expected for a UQ researcher)', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
