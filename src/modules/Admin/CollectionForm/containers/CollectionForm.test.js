import CollectionForm from './CollectionForm';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps
    };

    return getElement(CollectionForm, props, isShallow);
}

describe('CollectionForm container', () => {
    it('should mount', () => {
        const wrapper = setup({}, false);
    });

    it('should read the local storage', () => {
        const wrapper = setup({}, false);
        expect(localStorage.getItem).toHaveBeenLastCalledWith('form');
    });
});
