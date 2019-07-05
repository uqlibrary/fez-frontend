import DashboardAuthorAvatar from './DashboardAuthorAvatar';
import { authorDetails } from 'mock/data';

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    const props = {
        ...testProps,
    };
    return getElement(DashboardAuthorAvatar, props, isShallow);
}

describe('Dashboard Author Details test', () => {
    it('Render the authors details as expected for a UQ researcher)', () => {
        const values = {
            values: {},
        };
        values.values = authorDetails.uqresearcher;
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
