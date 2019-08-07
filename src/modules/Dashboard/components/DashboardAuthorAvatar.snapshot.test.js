import DashboardAuthorAvatar from './DashboardAuthorAvatar';
import { authorDetails } from 'mock/data';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        ...testProps,
        values: authorDetails.uqresearcher,
    };
    return getElement(DashboardAuthorAvatar, props);
}

describe('Dashboard Author Details test', () => {
    it('Render the authors details as expected for a UQ researcher)', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
