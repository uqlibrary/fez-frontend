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

    it('Render the authors profile with publon id url constructed using ORCID id if publons id is 1', () => {
        const wrapper = setup({
            author: {
                ...mock.currentAuthor.uqresearcher.data,
                aut_publons_id: '1',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Render the authors profile with publon id url constructed using ORCID id if publons id is integer 1', () => {
        const wrapper = setup({
            author: {
                ...mock.currentAuthor.uqresearcher.data,
                aut_publons_id: 1,
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Render the authors profile with publon id url constructed using ORCID id if publons id is string 0', () => {
        const wrapper = setup({
            author: {
                ...mock.currentAuthor.uqresearcher.data,
                aut_publons_id: '0',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Render the authors profile with publon id url constructed using publons id if publons id is not 1', () => {
        const wrapper = setup({
            author: {
                ...mock.currentAuthor.uqresearcher.data,
                aut_publons_id: '1111-2222-3333-4444',
            },
        });
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
