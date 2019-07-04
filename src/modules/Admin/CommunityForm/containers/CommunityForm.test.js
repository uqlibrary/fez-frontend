import CommunityForm from './CommunityForm';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
    };

    return getElement(CommunityForm, props, isShallow);
}

describe('CommunityForm container', () => {
    it('should mount', () => {
        const wrapper = setup({}, false);
    });

    it('should read the local storage', () => {
        const wrapper = setup({}, false);
        expect(localStorage.getItem).toHaveBeenLastCalledWith('form');
    });
});
