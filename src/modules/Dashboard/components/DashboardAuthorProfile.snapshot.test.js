import { DashboardAuthorProfile } from './DashboardAuthorProfile';
import * as mock from 'mock/data';

function setup(testProps = {}, args = {}) {
    const props = {
        authorDetails: mock.authorDetails.uqresearcher,
        author: mock.currentAuthor.uqresearcher.data,
        history: {},
        classes: {},
        ...testProps,
    };
    return getElement(DashboardAuthorProfile, props, args);
}

describe('Dashboard Author Profile test', () => {
    it('Render the authors profile as expected for a UQ researcher)', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Renders empty div if there is no profile loaded', () => {
        const wrapper = setup({
            authorDetails: null,
            author: null,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Renders empty div if there is no profile but profile image exists', () => {
        const wrapper = setup({
            authorDetails: { uqr_id: null, image_exists: 1 },
            author: { title: null, aut_fname: null, aut_lname: null, aut_id: null },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
