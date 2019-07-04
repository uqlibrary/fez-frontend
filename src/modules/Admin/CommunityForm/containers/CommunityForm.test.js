import CommunityForm from './CommunityForm';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
    };

    return getElement(CommunityForm, props, isShallow);
}

describe('CommunityForm container', () => {
    it('should mount and read the local storage', () => {
        setup({}, false);
        expect(localStorage.getItem).toHaveBeenLastCalledWith('form');
    });
});
