import TopCitedPublications from './TopCitedPublications';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps
    };

    return getElement(TopCitedPublications, props, isShallow);
}

describe('TopCitedPublications container', () => {

    it('should mount', () => {
        const wrapper = setup({}, false);
    });

});
