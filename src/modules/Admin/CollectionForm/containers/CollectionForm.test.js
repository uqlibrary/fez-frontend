import CollectionForm from './CollectionForm';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
    };

    return getElement(CollectionForm, props, isShallow);
}

describe('CollectionForm container', () => {
    it('should mount and read the local storage', () => {
        setup({}, false);
        expect(localStorage.getItem).toHaveBeenLastCalledWith('form');
    });
});
