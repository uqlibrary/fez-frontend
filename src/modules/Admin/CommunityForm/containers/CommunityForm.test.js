import CommunityForm from './CommunityForm';

function setup(testProps, args = {}) {
    const props = {
        ...testProps,
    };

    return getElement(CommunityForm, props, args);
}

describe('CommunityForm container', () => {
    it('should mount and read the local storage', () => {
        setup({}, { isShallow: false });
        expect(localStorage.getItem).toHaveBeenLastCalledWith('form');
    });
});
