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

    it('Render the authors profile with publon id url constructed using ORCID id if publons id is 1', () => {
        const wrapper = setup({
            author: {
                ...mock.currentAuthor.uqresearcher.data,
                aut_publons_id: '1'
            },
        }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Render the authors profile with publon id url constructed using publons id if publons id is not 1', () => {
        const wrapper = setup({
            author: {
                ...mock.currentAuthor.uqresearcher.data,
                aut_publons_id: '1111-2222-3333-4444'
            },
        }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
