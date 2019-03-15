import {PublicationsListSorting} from './PublicationsListSorting';

jest.mock('locale', () => ({
    locale: {
        components: {
            sorting: {
                sortBy: [
                    {
                        value: false
                    }
                ],
                sortDirection: [
                    false
                ]
            }
        }
    }
}));

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps
    };

    return getElement(PublicationsListSorting, props, isShallow);
}

describe('PublicationsListSorting', () => {
    it('should create component with missing locale', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});