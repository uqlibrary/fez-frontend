import { DashboardAuthorDetails } from './DashboardAuthorDetails';
import { authorDetails } from 'mock/data';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        classes: {},
        values: authorDetails.uqresearcher,
        ...testProps,
    };
    return getElement(DashboardAuthorDetails, props);
}

describe('Dashboard Author Details test', () => {
    it('Render the authors details as expected for a UQ researcher)', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
