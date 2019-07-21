import { PublicationsListSorting } from './PublicationsListSorting';

jest.mock('locale', () => ({
    locale: {
        components: {
            sorting: {
                sortBy: [
                    {
                        value: false,
                    },
                ],
                sortDirection: [false],
            },
        },
    },
}));

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return getElement(PublicationsListSorting, props);
}

describe('PublicationsListSorting', () => {
    it('should create component with missing locale', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
